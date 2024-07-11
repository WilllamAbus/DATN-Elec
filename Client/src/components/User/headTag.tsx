import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const HeadTags: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <link href="../../assets/images/favicon/favicon.ico" type="image/x-icon" />
      
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" /> */}
        {/* <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        /> */}
      </Helmet>
    </HelmetProvider>
  );
};

export default HeadTags;