import React from 'react' 
import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_RECIPES, CATEGORY_TREE } from './data'
import Sidebar from './components/Sidebar'
import RecipeCard from './components/RecipeCard'
import RecipeForm from './components/RecipeForm'

const STORAGE_KEY = 'recipe_vault_v2'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return null
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {}
}

function getAllCats(tree, out = []) {
  for (const [k, v] of Object.entries(tree)) {
    out.push(k)
    getAllCats(v, out)
  }
  return out
}
export const ALL_CATS = getAllCats(CATEGORY_TREE)

export default function App() {
  const [recipes, setRecipes] = useState(() => {
    const saved = loadFromStorage()
    return saved?.recipes ?? DEFAULT_RECIPES
  })
  const [selectedCat, setSelectedCat] = useState('all')
  const [expandedCats, setExpandedCats] = useState(() => {
    const saved = loadFromStorage()
    return saved?.expandedCats ?? { Food: true, Soap: true, Balm: true, Sanitizer: true }
  })
  const [search, setSearch] = useState('')
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    saveToStorage({ recipes, expandedCats })
  }, [recipes, expandedCats])

  const filteredRecipes = recipes.filter(r => {
    const matchCat = selectedCat === 'all' || r.categories.includes(selectedCat)
    const q = search.toLowerCase()
    const matchSearch = !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      r.categories.some(c => c.toLowerCase().includes(q)) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  const countInCat = useCallback((cat) =>
    recipes.filter(r => r.categories.includes(cat)).length
  , [recipes])

  function saveRecipe(recipe) {
    setRecipes(prev => {
      const idx = prev.findIndex(r => r.id === recipe.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = recipe
        return next
      }
      return [...prev, recipe]
    })
    setEditingRecipe(null)
    setIsAdding(false)
  }

  function deleteRecipe(id) {
    if (!confirm('Delete this recipe?')) return
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  const catTitle = selectedCat === 'all' ? 'All Recipes' : selectedCat

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">Recipe <span>Vault</span></div>
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="6.5" cy="6.5" r="4.5"/><path d="m10.5 10.5 3 3"/>
          </svg>
          <input
            placeholder="Search recipes, ingredients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Add recipe</button>
        </div>
      </header>

      <div className="body-wrap">
        <Sidebar
          tree={CATEGORY_TREE}
          selectedCat={selectedCat}
          expandedCats={expandedCats}
          setExpandedCats={setExpandedCats}
          onSelect={cat => setSelectedCat(cat)}
          countInCat={countInCat}
          totalCount={recipes.length}
        />

        <main className="main-content">
          <div className="page-header">
            <span className="page-title">{catTitle}</span>
            <span className="page-count">{filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}</span>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 32 }}>🥄</div>
              <p>{search ? 'No recipes match your search.' : 'No recipes in this category yet.'}</p>
              {!search && <button className="btn btn-accent" style={{ marginTop: 12 }} onClick={() => setIsAdding(true)}>Add your first recipe</button>}
            </div>
          ) : (
            filteredRecipes.map(r => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onEdit={() => setEditingRecipe(r)}
                onDelete={() => deleteRecipe(r.id)}
              />
            ))
          )}
        </main>
      </div>

      {(isAdding || editingRecipe) && (
        <RecipeForm
          recipe={editingRecipe}
          onSave={saveRecipe}
          onClose={() => { setIsAdding(false); setEditingRecipe(null) }}
        />
      )}
    </div>
  )
}



