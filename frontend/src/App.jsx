import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { Article as ArticleIcon, Update, OpenInNew } from '@mui/icons-material';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const API_URL = 'http://localhost:8000/api/articles';

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(API_URL);
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredArticles = articles.filter(article => {
    if (tabValue === 0) return !article.is_updated; // Original
    if (tabValue === 1) return article.is_updated; // Updated
    return true; // All
  });

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <ArticleIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BeyondChats Articles Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Original Articles" />
            <Tab label="Updated Articles" />
            <Tab label="All Articles" />
          </Tabs>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredArticles.map((article) => (
              <Grid item xs={12} md={6} lg={4} key={article.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" component="h2">
                        {article.title}
                      </Typography>
                      {article.is_updated ? (
                        <Chip icon={<Update />} label="Updated" color="success" size="small" />
                      ) : (
                        <Chip icon={<ArticleIcon />} label="Original" color="primary" size="small" />
                      )}
                    </Box>
                    
                    <Typography color="textSecondary" gutterBottom>
                      Published: {new Date(article.published_date).toLocaleDateString()}
                    </Typography>
                    
                    <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                      {article.content.substring(0, 150)}...
                    </Typography>
                    
                    {article.references && article.references.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="caption" color="textSecondary">
                          References:
                        </Typography>
                        <Box>
                          {JSON.parse(article.references).map((ref, index) => (
                            <Typography key={index} variant="caption" display="block">
                              • {ref}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      href={article.url} 
                      target="_blank"
                      startIcon={<OpenInNew />}
                    >
                      View Original
                    </Button>
                    {article.original_article_id && (
                      <Button size="small" color="secondary">
                        Compare with Original
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {!loading && filteredArticles.length === 0 && (
          <Box textAlign="center" py={10}>
            <Typography variant="h6" color="textSecondary">
              No articles found in this category
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default App;