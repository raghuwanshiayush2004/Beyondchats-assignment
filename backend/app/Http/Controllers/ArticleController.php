<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

class ArticleController extends Controller
{
    // Fetch and store articles from BeyondChats
    public function scrapeAndStore()
    {
        try {
            $url = "https://beyondchats.com/blogs/";
            $response = Http::get($url);
            
            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to fetch blog page'], 500);
            }
            
            $html = $response->body();
            $crawler = new Crawler($html);
            
            $articles = [];
            $crawler->filter('article')->each(function (Crawler $node, $i) use (&$articles) {
                if ($i < 5) { // Get 5 oldest (assuming last page articles)
                    $title = $node->filter('h2')->text();
                    $content = $node->filter('.entry-content')->text();
                    $link = $node->filter('a')->attr('href');
                    $date = $node->filter('time')->attr('datetime');
                    
                    $articles[] = Article::create([
                        'title' => $title,
                        'content' => $content,
                        'url' => $link,
                        'published_date' => $date,
                        'original_source' => 'beyondchats.com'
                    ]);
                }
            });
            
            return response()->json([
                'message' => 'Articles scraped and stored successfully',
                'articles' => $articles
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // CRUD Operations
    public function index()
    {
        return Article::all();
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'url' => 'nullable|url',
            'published_date' => 'nullable|date',
        ]);
        
        return Article::create($validated);
    }
    
    public function show($id)
    {
        return Article::findOrFail($id);
    }
    
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'references' => 'nullable|array',
            'is_updated' => 'boolean'
        ]);
        
        $article->update($validated);
        return $article;
    }
    
    public function destroy($id)
    {
        Article::destroy($id);
        return response()->json(null, 204);
    }
}