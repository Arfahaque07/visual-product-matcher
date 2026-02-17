const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const fs = require('fs');
const axios = require('axios');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Extract keywords from image URL or filename
const extractKeywordsFromSource = (source) => {
  const keywords = [];
  const sourceLower = source.toLowerCase();
  
  // Check for shoe-related keywords
  if (sourceLower.includes('shoe') || 
      sourceLower.includes('sneaker') || 
      sourceLower.includes('footwear') ||
      sourceLower.includes('air-max') ||
      sourceLower.includes('ultraboost') ||
      sourceLower.includes('vans') ||
      sourceLower.includes('converse') ||
      sourceLower.includes('nike') ||
      sourceLower.includes('adidas') ||
      sourceLower.includes('puma') ||
      sourceLower.includes('reebok') ||
      sourceLower.includes('2529148')) { // Pexels shoe image ID
    keywords.push('Footwear');
    keywords.push('shoe');
    console.log('🔍 Detected: Footwear');
  }
  
  // Check for watch-related keywords
  if (sourceLower.includes('watch') || 
      sourceLower.includes('rolex') || 
      sourceLower.includes('apple-watch') ||
      sourceLower.includes('casio') ||
      sourceLower.includes('g-shock') ||
      sourceLower.includes('omega') ||
      sourceLower.includes('tag') ||
      sourceLower.includes('fossil') ||
      sourceLower.includes('seiko') ||
      sourceLower.includes('190819')) { // Pexels watch image ID
    keywords.push('Watches');
    keywords.push('watch');
    console.log('🔍 Detected: Watches');
  }
  
  // Check for clothing-related keywords
  if (sourceLower.includes('jean') || 
      sourceLower.includes('jacket') || 
      sourceLower.includes('shirt') ||
      sourceLower.includes('tshirt') ||
      sourceLower.includes('hoodie') ||
      sourceLower.includes('north-face') ||
      sourceLower.includes('levi') ||
      sourceLower.includes('pants') ||
      sourceLower.includes('sweater') ||
      sourceLower.includes('dress') ||
      sourceLower.includes('coat') ||
      sourceLower.includes('52518')) { // Pexels clothing image ID
    keywords.push('Clothing');
    keywords.push('clothing');
    console.log('🔍 Detected: Clothing');
  }
  
  // Check for electronics
  if (sourceLower.includes('iphone') || 
      sourceLower.includes('samsung') || 
      sourceLower.includes('macbook') ||
      sourceLower.includes('sony') ||
      sourceLower.includes('headphone') ||
      sourceLower.includes('ipad') ||
      sourceLower.includes('laptop') ||
      sourceLower.includes('phone') ||
      sourceLower.includes('camera') ||
      sourceLower.includes('speaker') ||
      sourceLower.includes('tv') ||
      sourceLower.includes('monitor')) {
    keywords.push('Electronics');
    keywords.push('electronics');
    console.log('🔍 Detected: Electronics');
  }
  
  // Check for accessories
  if (sourceLower.includes('sunglass') || 
      sourceLower.includes('ray-ban') || 
      sourceLower.includes('backpack') ||
      sourceLower.includes('bag') ||
      sourceLower.includes('wallet') ||
      sourceLower.includes('belt') ||
      sourceLower.includes('hat') ||
      sourceLower.includes('cap') ||
      sourceLower.includes('glasses') ||
      sourceLower.includes('326823')) { // Pexels sunglasses image ID
    keywords.push('Accessories');
    keywords.push('accessories');
    console.log('🔍 Detected: Accessories');
  }
  
  console.log('📝 Extracted keywords:', keywords);
  return keywords;
};

// Calculate text-based similarity
const calculateTextSimilarity = (keywords, product) => {
  if (!keywords || keywords.length === 0) return 0.1;
  
  let score = 0;
  const productCategory = (product.category || '').toLowerCase();
  const productName = (product.name || '').toLowerCase();
  const productDesc = (product.description || '').toLowerCase();
  
  // Check for exact category match (highest weight)
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (productCategory.includes(keywordLower) || 
        keywordLower.includes(productCategory)) {
      score += 0.5;
      console.log(`  ✅ Category match: ${productCategory} +0.5`);
    }
  });
  
  // Check for name matches
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (productName.includes(keywordLower)) {
      score += 0.3;
      console.log(`  ✅ Name match: ${productName} +0.3`);
    } else if (productDesc.includes(keywordLower)) {
      score += 0.2;
      console.log(`  ✅ Description match +0.2`);
    }
  });
  
  return Math.min(1, score);
};

// Search by uploaded image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    console.log('\n📸 Processing uploaded image:', req.file.originalname);
    
    // Extract keywords from filename
    const keywords = extractKeywordsFromSource(req.file.originalname);
    
    // Get all products from database
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products in database`);
    
    // Calculate similarity for each product
    const results = products.map(product => {
      const similarity = calculateTextSimilarity(keywords, product);
      
      return {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        features: product.features,
        similarity: similarity,
        matchScore: Math.round(similarity * 100)
      };
    });

    // Filter and sort
    const validResults = results
      .filter(r => r.similarity > 0.2)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 20);

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    console.log(`✅ Returning ${validResults.length} matches`);

    res.json({
      success: true,
      query: {
        filename: req.file.originalname,
        keywords: keywords
      },
      results: validResults,
      totalResults: validResults.length
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search by image URL - IMPROVED VERSION
router.post('/url', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    console.log('\n🔗 Processing URL:', imageUrl);
    
    // Extract keywords from URL FIRST (before trying to download)
    const keywords = extractKeywordsFromSource(imageUrl);
    console.log('📝 Extracted keywords from URL:', keywords);
    
    // If we have keywords, we can return results even if image download fails
    if (keywords.length > 0) {
      // Get all products
      const products = await Product.find();
      console.log(`📦 Found ${products.length} products in database`);
      
      // Calculate similarities
      const results = products.map(product => {
        const similarity = calculateTextSimilarity(keywords, product);
        
        return {
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description,
          features: product.features,
          similarity: similarity,
          matchScore: Math.round(similarity * 100)
        };
      });

      // Filter and sort
      const validResults = results
        .filter(r => r.similarity > 0.2)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 20);

      console.log(`✅ Returning ${validResults.length} matches based on URL keywords`);

      return res.json({
        success: true,
        query: { 
          imageUrl,
          keywords: keywords,
          method: 'url-keywords'
        },
        results: validResults,
        totalResults: validResults.length
      });
    }
    
    // If no keywords in URL, try to download the image
    try {
      // Download image from URL with better options
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'arraybuffer',
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        }
      });

      // Check if response is an image
      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        console.log('⚠️ URL does not point to an image, using keywords only');
        return res.json({
          success: true,
          query: { 
            imageUrl,
            keywords: keywords,
            warning: 'URL did not return an image, used keywords from URL only'
          },
          results: [],
          totalResults: 0
        });
      }

      // Save temporarily
      const tempDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempPath = path.join(tempDir, `temp-${Date.now()}.jpg`);
      fs.writeFileSync(tempPath, response.data);

      // Extract keywords from filename as well
      const fileKeywords = extractKeywordsFromSource(path.basename(imageUrl));
      const allKeywords = [...new Set([...keywords, ...fileKeywords])];
      
      // Get all products
      const products = await Product.find();
      
      // Calculate similarities using keywords
      const results = products.map(product => {
        const similarity = calculateTextSimilarity(allKeywords, product);
        
        return {
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description,
          features: product.features,
          similarity: similarity,
          matchScore: Math.round(similarity * 100)
        };
      });

      // Filter and sort
      const validResults = results
        .filter(r => r.similarity > 0.2)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 20);

      // Clean up temp file
      fs.unlink(tempPath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });

      console.log(`✅ URL search returning ${validResults.length} matches`);

      res.json({
        success: true,
        query: { 
          imageUrl,
          keywords: allKeywords 
        },
        results: validResults,
        totalResults: validResults.length
      });

    } catch (downloadError) {
      console.log('⚠️ Could not download image:', downloadError.message);
      
      // Still return results based on URL keywords
      const products = await Product.find();
      
      const results = products.map(product => {
        const similarity = calculateTextSimilarity(keywords, product);
        
        return {
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description,
          features: product.features,
          similarity: similarity,
          matchScore: Math.round(similarity * 100)
        };
      });

      const validResults = results
        .filter(r => r.similarity > 0.2)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 20);

      res.json({
        success: true,
        query: { 
          imageUrl,
          keywords: keywords,
          note: 'Used keywords from URL (image could not be downloaded)'
        },
        results: validResults,
        totalResults: validResults.length
      });
    }

  } catch (error) {
    console.error('❌ URL search error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      details: error.message 
    });
  }
});

module.exports = router;