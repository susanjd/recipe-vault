Last file! src/components/RecipeForm.jsx:
jsximport { useState } from 'react'
import { ALL_CATS } from '../App'

function newId() {
  return 'r' + Date.now() + Math.random().toString(36).slice(2, 6)
}

export default function RecipeForm({ recipe, onSave, onClose }) {
  const isEdit = !!recipe
  const [title, setTitle] = useState(recipe?.title ?? '')
  const [description, setDescription] = useState(recipe?.description ?? '')
  const [baseServings, setBaseServings] = useState(recipe?.baseServings ?? 4)
  const [servingLabel, setServingLabel] = useState(recipe?.servingLabel ?? 'servings')
  const [selectedCats, setSelectedCats] = useState(new Set(recipe?.categories ?? []))
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients ?? [{ id: 'i1', name: '', amount: '', unit: '' }]
  )
  const [steps, setSteps] = useState(
    recipe?.steps ?? [{ id: 's1', title: '', text: '', timer: '' }]
  )
  const [notes, setNotes] = useState(recipe?.notes ?? '')
  const [error, setError] = useState('')

  function toggleCat(cat) {
    setSelectedCats(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function addIngredient() {
    setIngredients(prev => [...prev, { id: 'i' + Date.now(), name: '', amount: '', unit: '' }])
  }
  function updateIngredient(id, field, val) {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i))
  }
  function removeIngredient(id) {
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

  function addStep() {
    setSteps(prev => [...prev, { id: 's' + Date.now(), title: '', text: '', timer: '' }])
  }
  function updateStep(id, field, val) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
  }
  function removeStep(id) {
    setSteps(prev => prev.filter(s => s.id !== id))
  }

  function handleSave() {
    if (!title.trim()) { setError('Title is required.'); return }
    const cleanIngredients = ingredients
      .filter(i => i.name.trim())
      .map((i, idx) => ({
        id: i.id || 'i' + (idx + 1),
        name: i.name.trim(),
        amount: parseFloat(i.amount) || 0,
        unit: i.unit.trim(),
      }))
    const cleanSteps = steps
      .filter(s => s.title.trim())
      .map((s, idx) => ({
        id: s.id || 's' + (idx + 1),
        title: s.title.trim(),
        text: s.text.trim(),
        timer: s.timer ? parseInt(s.timer) || null : null,
      }))

    onSave({
      id: recipe?.id ?? newId(),
      title: title.trim(),
      description: description.trim(),
      baseServings: parseInt(baseServings) || 1,
      servingLabel: servingLabel.trim() || 'servings',
      categories: [...selectedCats],
      ingredients: cleanIngredients,
      steps: cleanSteps,
      notes: notes.trim(),
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Recipe' : 'New Recipe'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div style={{ color: '#a32d2d', fontSize: 13, padding: '8px 12px', background: '#fcebeb', borderRadius: 6 }}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Recipe name" />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Base servings</label>
              <input className="form-input" type="number" min="0.25" step="0.25" value={baseServings} onChange={e => setBaseServings(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Serving label</label>
              <input className="form-input" value={servingLabel} onChange={e => setServingLabel(e.target.value)} placeholder="servings / batch / tins" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categories</label>
            <div className="cats-grid">
              {ALL_CATS.map(cat => (
                <label key={cat} className={`cat-checkbox${selectedCats.has(cat) ? ' checked' : ''}`}>
                  <input type="checkbox" checked={selectedCats.has(cat)} onChange={() => toggleCat(cat)} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div class="section-subhead">
              <label className="form-label">Ingredients</label>
              <button className="add-row-btn" onClick={addIngredient}>+ Add ingredient</button>
            </div>
            <div className="dynamic-list">
              {ingredients.map(i => (
                <div key={i.id} className="dynamic-row" style={{ alignItems: 'center' }}>
                  <input placeholder="Name" value={i.name} onChange={e => updateIngredient(i.id, 'name', e.target.value)} style={{ flex: 2 }} />
                  <input placeholder="Amount" value={i.amount} onChange={e => updateIngredient(i.id, 'amount', e.target.value)} style={{ flex: 1, maxWidth: 80 }} />
                  <input placeholder="Unit" value={i.unit} onChange={e => updateIngredient(i.id, 'unit', e.target.value)} style={{ flex: 1, maxWidth: 72 }} />
                  <button className="rm-btn" onClick={() => removeIngredient(i.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div class="section-subhead">
              <label className="form-label">Steps</label>
              <button className="add-row-btn" onClick={addStep}>+ Add step</button>
            </div>
            <div className="dynamic-list">
              {steps.map((s, idx) => (
                <div key={s.id} className="dynamic-row" style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <input placeholder={`Step ${idx + 1} title`} value={s.title} onChange={e => updateStep(s.id, 'title', e.target.value)} />
                    <textarea placeholder="Instructions" value={s.text} onChange={e => updateStep(s.id, 'text', e.target.value)} />
                    <input placeholder="Timer in seconds (e.g. 600 = 10 min)" value={s.timer} onChange={e => updateStep(s.id, 'timer', e.target.value)} />
                  </div>
                  <button className="rm-btn" onClick={() => removeStep(s.id)} style={{ marginTop: 4 }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tips, variations, safety notes..." style={{ minHeight: 100 }} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save recipe</button>
        </div>
      </div>
    </div>
  )
}
