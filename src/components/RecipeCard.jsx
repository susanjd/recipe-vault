import React from 'react'
import { useState, useEffect, useRef } from 'react'

function scaleAmt(amount, base, current) {
  const scaled = amount * (current / base)
  if (scaled === 0) return '0'
  if (Math.abs(scaled - Math.round(scaled)) < 0.001) return Math.round(scaled).toString()
  if (scaled < 1) return parseFloat(scaled.toFixed(2)).toString()
  return parseFloat(scaled.toFixed(1)).toString()
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function Timer({ duration }) {
  const [state, setState] = useState('idle')
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function start() {
    setState('running')
    setRemaining(duration)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setState('done')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function reset() {
    clearInterval(intervalRef.current)
    setState('idle')
    setRemaining(duration)
  }

  const mins = Math.floor(duration / 60)
  const secs = duration % 60
  const label = mins > 0 ? `${mins}m${secs > 0 ? ` ${secs}s` : ''}` : `${secs}s`

  if (state === 'idle') return <button className="timer-btn" onClick={start}>⏱ {label}</button>
  if (state === 'done') return <button className="timer-btn done" onClick={reset}>✓ Done — tap to reset</button>
  return <button className="timer-btn running" onClick={reset}>⏳ {formatTime(remaining)} — tap to cancel</button>
}

export default function RecipeCard({ recipe, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const [servings, setServings] = useState(recipe.baseServings)

  const topCat = recipe.categories[0]
  const otherCats = recipe.categories.slice(1)

  return (
    <div className="recipe-card">
      <div className="recipe-header" onClick={() => setOpen(o => !o)}>
        <div className="recipe-header-info">
          <div className="recipe-title">{recipe.title}</div>
          <div className="recipe-tags">
            {topCat && <span className="tag top">{topCat}</span>}
            {otherCats.map(c => <span key={c} className="tag">{c}</span>)}
          </div>
        </div>
        <span className={`chevron${open ? ' open' : ''}`}>⌄</span>
      </div>

      {open && (
        <div className="recipe-body">
          {recipe.description && (
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.55 }}>{recipe.description}</p>
          )}

          <div className="scale-bar">
            <label>Scale</label>
            <input
              type="range"
              min={0.25}
              max={recipe.baseServings * 8}
              step={0.25}
              value={servings}
              onChange={e => setServings(parseFloat(e.target.value))}
            />
            <span className="scale-val">
              {servings % 1 === 0 ? servings : servings.toFixed(2)} {recipe.servingLabel || 'servings'}
            </span>
          </div>

          <div className="section-title">Ingredients</div>
          <div className="ingredients-grid">
            {recipe.ingredients.map(i => (
              <div key={i.id} className="ingredient-row">
                <span className="ing-name">{i.name}</span>
                <span className="ing-amt">{scaleAmt(i.amount, recipe.baseServings, servings)} {i.unit || ''}</span>
              </div>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 20 }}>Steps</div>
          <div className="steps-list">
            {recipe.steps.map((s, idx) => (
              <div key={s.id} className="step-item">
                <div className="step-num">{idx + 1}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-text">{s.text}</div>
                  {s.timer && <Timer duration={s.timer} />}
                </div>
              </div>
            ))}
          </div>

          {recipe.notes && (
            <>
              <div className="section-title" style={{ marginTop: 20 }}>Notes</div>
              <div className="notes-box">{recipe.notes}</div>
            </>
          )}

          <div className="recipe-actions">
            <button className="btn btn-sm" onClick={onEdit}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}
