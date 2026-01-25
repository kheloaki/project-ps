import React from 'react';

const BlogTitle = () => {
  return (
    <section 
      className="bg-white"
      style={{
        paddingTop: '60px',
        paddingBottom: '40px'
      }}
    >
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <h1 
            className="m-0 text-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '48px',
              fontWeight: 600,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: '#121212'
            }}
          >
            News
          </h1>
        </div>
      </div>
    </section>
  );
};

export default BlogTitle;