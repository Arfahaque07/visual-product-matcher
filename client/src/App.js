import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Slider,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  Link as LinkIcon,
  Clear as ClearIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import API_BASE_URL from './config';  // ✅ IMPORT ADDED

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [similarityThreshold, setSimilarityThreshold] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [queryImage, setQueryImage] = useState(null);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setUploadedImage(null);
    setImageUrl('');
    setResults([]);
    setError('');
  };

  // File upload dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
          setQueryImage(file);
        };
        reader.readAsDataURL(file);
        setError('');
      }
    },
    onDropRejected: (fileRejections) => {
      setError('File too large or invalid format. Max size: 5MB');
    }
  });

  // Handle URL input
  const handleUrlSubmit = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }

    try {
      // Validate URL format
      new URL(imageUrl);
      setLoading(true);
      setError('');
      
      // ✅ FIXED: Using API_BASE_URL instead of localhost
      const response = await axios.post(`${API_BASE_URL}/search/url`, {
        imageUrl: imageUrl
      });
      
      setResults(response.data.results || []);
      setQueryImage({ url: imageUrl });
      
      // Extract unique categories from results
      const uniqueCategories = [...new Set(response.data.results.map(r => r.category))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      if (err.message.includes('Invalid URL')) {
        setError('Please enter a valid URL');
      } else {
        setError(err.response?.data?.error || 'Failed to search by URL');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload search
  const handleFileSearch = async () => {
    if (!uploadedImage || !queryImage) {
      setError('Please upload an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', queryImage);

    try {
      setLoading(true);
      setError('');
      
      // ✅ FIXED: Using API_BASE_URL instead of localhost
      const response = await axios.post(`${API_BASE_URL}/search/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResults(response.data.results || []);
      
      // Extract unique categories from results
      const uniqueCategories = [...new Set(response.data.results.map(r => r.category))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and search image');
    } finally {
      setLoading(false);
    }
  };

  // Clear uploaded image
  const handleClearImage = () => {
    setUploadedImage(null);
    setQueryImage(null);
    setResults([]);
    setError('');
  };

  // Filter results by similarity and category
  const filteredResults = results
    .filter(item => item.similarity >= similarityThreshold / 100)
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .sort((a, b) => b.similarity - a.similarity);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
        <Toolbar>
          <ImageIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Visual Product Matcher
          </Typography>
          <Chip 
            label="Find similar products by image" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Upload an Image to Find Similar Products
          </Typography>
          
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab icon={<UploadIcon />} label="File Upload" />
            <Tab icon={<LinkIcon />} label="Image URL" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {activeTab === 0 && (
            <Box>
              {!uploadedImage ? (
                <Paper
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: '#fafafa',
                    '&:hover': {
                      borderColor: '#2c3e50',
                      bgcolor: '#f0f0f0'
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Drag & drop an image here
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    or click to select (Max: 5MB)
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <IconButton
                      onClick={handleClearImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleFileSearch}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                      sx={{ bgcolor: '#2c3e50', '&:hover': { bgcolor: '#1a252f' } }}
                    >
                      {loading ? 'Searching...' : 'Find Similar Products'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleUrlSubmit}
                        disabled={loading || !imageUrl}
                        edge="end"
                      >
                        {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              
              {queryImage?.url && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Query Image:</Typography>
                  <img
                    src={queryImage.url}
                    alt="Query"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200?text=Invalid+Image';
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Paper>

        {loading && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <LinearProgress />
            <Typography align="center" sx={{ mt: 1 }}>
              Searching for similar products...
            </Typography>
          </Box>
        )}

        {results.length > 0 && !loading && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Similarity Threshold: {similarityThreshold}%</Typography>
                  <Slider
                    value={similarityThreshold}
                    onChange={(e, val) => setSimilarityThreshold(val)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Found {filteredResults.length} similar products
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {filteredResults.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {product.category}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ${product.price?.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Chip
                          label={`${product.matchScore || Math.round(product.similarity * 100)}% Match`}
                          color={product.similarity > 0.7 ? 'success' : 'primary'}
                          size="small"
                        />
                        <Typography variant="caption" color="textSecondary">
                          Similarity: {(product.similarity * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredResults.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No products match your current filters. Try adjusting the similarity threshold or category.
              </Alert>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default App;