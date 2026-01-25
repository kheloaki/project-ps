# Product Creation Scripts

Scripts to create products in your database from various sources.

## Available Scripts

### 1. Create Products from JSON File

Create or update products from a JSON file:

```bash
npm run create-products file <path-to-json-file>
```

**Example:**
```bash
npm run create-products file src/data/products.json
```

### 2. Scrape Products from Website

Scrape products from peptidesskin.com (requires puppeteer):

```bash
# First install puppeteer (optional)
npm install puppeteer

# Then scrape
npm run scrape-products

# After scraping, create products from the scraped data
npm run create-products file scripts/scraped-products.json
```

## Product JSON Format

Your JSON file should be an array of product objects with the following structure:

```json
[
  {
    "handle": "product-handle",
    "title": "Product Title",
    "price": "$99.00 USD",
    "image": "https://example.com/image.jpg",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "description": "Short product description",
    "bodyHtml": "<p>Full HTML content for product page</p>",
    "seoTitle": "SEO Title",
    "seoDescription": "SEO Description",
    "category": "Business & Industrial > Science & Laboratory > Biochemicals",
    "coaImageUrl": "https://example.com/coa.jpg",
    "variants": [
      {
        "title": "Default Title",
        "price": "$99.00 USD",
        "sku": "SKU-001",
        "image": "https://example.com/variant-image.jpg"
      }
    ]
  }
]
```

### Required Fields

- `handle` - Unique URL-friendly identifier (e.g., "nad", "sermorelin")
- `title` - Product title
- `price` - Product price (e.g., "$55.00 USD")
- `image` - Main product image URL
- `description` - Product description
- `category` - Product category

### Optional Fields

- `images` - Array of additional image URLs
- `bodyHtml` - Full HTML content for product page
- `seoTitle` - SEO title
- `seoDescription` - SEO description
- `coaImageUrl` - Certificate of Analysis image URL
- `variants` - Array of product variants

## How It Works

1. **From File**: Reads a JSON file and creates/updates products in the database
2. **From Website**: Scrapes product data from peptidesskin.com and saves to JSON, then you can create products from that file

## Notes

- Products with existing handles will be **updated** instead of created
- The script will skip products with missing required fields
- Variants are created/updated along with products
- All operations use Prisma to interact with your PostgreSQL database

## Example Workflow

1. **Option A: Use existing products.json**
   ```bash
   npm run create-products file src/data/products.json
   ```

2. **Option B: Scrape from website**
   ```bash
   npm install puppeteer
   npm run scrape-products
   npm run create-products file scripts/scraped-products.json
   ```

3. **Option C: Create custom JSON file**
   - Create a JSON file with your product data
   - Run: `npm run create-products file path/to/your/products.json`

## Troubleshooting

- **"Puppeteer not found"**: Install it with `npm install puppeteer`
- **"Product already exists"**: The script will update existing products automatically
- **"Missing required fields"**: Ensure all required fields are present in your JSON
- **Database connection errors**: Check your `DATABASE_URL` environment variable

