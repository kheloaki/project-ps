import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET to your .env file');
}

/**
 * POST /api/webhooks/clerk
 * Handle Clerk webhook events
 */
export async function POST(request: NextRequest) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error occurred -- no svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Error occurred -- verification failed' },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      case 'session.created':
        await handleSessionCreated(evt.data);
        break;
      case 'session.ended':
        await handleSessionEnded(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true, eventType });
  } catch (error: any) {
    console.error(`Error handling webhook event ${eventType}:`, error);
    return NextResponse.json(
      { error: `Error processing webhook: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Handle user.created event
 */
async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url, created_at } = data;

  const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id)?.email_address;

  try {
    // Create user profile in database
    await prisma.userProfile.upsert({
      where: { clerkUserId: id },
      update: {
        email: primaryEmail || email_addresses?.[0]?.email_address || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        updatedAt: new Date(),
      },
      create: {
        clerkUserId: id,
        email: primaryEmail || email_addresses?.[0]?.email_address || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        createdAt: new Date(created_at),
      },
    });

    console.log(`✅ User created: ${id}`);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url, updated_at } = data;

  const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id)?.email_address;

  try {
    await prisma.userProfile.update({
      where: { clerkUserId: id },
      data: {
        email: primaryEmail || email_addresses?.[0]?.email_address || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
        updatedAt: new Date(updated_at || Date.now()),
      },
    });

    console.log(`✅ User updated: ${id}`);
  } catch (error: any) {
    // If user doesn't exist, create it
    if (error.code === 'P2025') {
      await handleUserCreated(data);
    } else {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(data: any) {
  const { id } = data;

  try {
    await prisma.userProfile.delete({
      where: { clerkUserId: id },
    });

    console.log(`✅ User deleted: ${id}`);
  } catch (error: any) {
    // User might not exist, which is fine
    if (error.code !== 'P2025') {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

/**
 * Handle session.created event
 */
async function handleSessionCreated(data: any) {
  // Optional: Track user sessions
  console.log(`Session created for user: ${data.user_id}`);
}

/**
 * Handle session.ended event
 */
async function handleSessionEnded(data: any) {
  // Optional: Track user sessions
  console.log(`Session ended for user: ${data.user_id}`);
}

