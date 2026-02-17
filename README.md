Visual Product Matcher

A web application that allows users to upload an image of a product and find visually similar products. It uses image similarity matching techniques to help users discover products based on visual features like color, shape, and texture — similar to visual search systems in modern e-commerce platforms.

🧠 link

**Frontend**: [https://visual-product-matcher-drab-nine.vercel.app](https://visual-product-matcher-drab-nine.vercel.app)  
**Backend API**: [https://visual-product-matcher-iytt.onrender.com](https://visual-product-matcher-iytt.onrender.com)

## 🧪 Example Images to Test

Use these sample images to try the visual matcher:

⌚ Watch example 
https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg

👕 Clothing example  
https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg

🛠️ Features

🔍 Upload an image of a product
📸 Visual similarity search to find matching products
🖼️ Displays similar or identical products based on the uploaded image
⚡ Fast and responsive interface
💡 Supports multiple product types

🧩 How It Works

1. The user uploads an image.
2. The app processes the image using a visual feature extractor (e.g., ML model, embeddings).
3. Similar product images from the dataset are retrieved using similarity comparison.
4. Matching products are displayed with thumbnails and basic info.
   
🚀 Tech Stack
| Frontend | Backend | Database | Hosting |
|----------|---------|----------|---------|
| React.js | Node.js | MongoDB | Vercel (frontend) |
| Material-UI | Express.js | MongoDB Atlas | Render (backend) |
| Axios | Multer | | |

visual-product-matcher/
├── client/               # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── config.js     # API configuration
│   │   └── ...
│   └── package.json
│
├── server/               # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md

📌 Usage

1. 🖼️ Click Upload or drag & drop an image.
2. 🔄 Wait for the similarity search to complete.
3. 📋 View similar products and results.
