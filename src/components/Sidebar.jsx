import React from 'react'
function toggle() {
    if (hasChildren) {
      setExpandedCats(prev => ({ ...prev, [name]: !prev[name] }))
    }
    onSelect(name)
  }

  return (
    <div>
      <div
        className={`cat-item${isActive ? ' active' : ''}`}
        style={{ paddingLeft: 16 + depth * 12 }}
        onClick={toggle}
      >
        {hasChildren ? (
          <span className={`cat-arrow${isExpanded ? ' open' : ''}`}>▶</span>
        ) : (
          <span style={{ width: 14, display: 'inline-block' }} />
        )}
        {name}
        {count > 0 && <span className="cat-count">{count}</span>}
      </div>
      {hasChildren && isExpanded && (
        <div className="cat-children">
          {Object.entries(children).map(([childName, grandChildren]) => (
            <CatNode
              key={childName}
              name={childName}
              children={grandChildren}
              depth={depth + 1}
              selectedCat={selectedCat}
              expandedCats={expandedCats}
              setExpandedCats={setExpandedCats}
              onSelect={onSelect}
              countInCat={countInCat}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ tree, selectedCat, expandedCats, setExpandedCats, onSelect, countInCat, totalCount }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-label">Browse</div>
      <div 
        className={`cat-item${selectedCat === 'all' ? ' active' : ''}`}
        onClick={() => onSelect('all')}
        style={{ paddingLeft: 16 }}
      >
        <span style={{ width: 14, display: 'inline-block' }} />
        All recipes
        <span className="cat-count">{totalCount}</span>
      </div>
      <div className="sidebar-label" style={{ marginTop: 8 }}>Categories</div>
      {Object.entries(tree).map(([name, children]) => (
        <CatNode
          key={name}
          name={name}
          children={children}
          depth={0}
          selectedCat={selectedCat}
          expandedCats={expandedCats}
          setExpandedCats={setExpandedCats}
          onSelect={onSelect}
          countInCat={countInCat}
        />
      ))}
    </nav>
  )
}