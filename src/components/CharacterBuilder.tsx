"use client";
import { Character } from '@/types';
import {
  DEFAULT_CHARACTER, HAIR_COLORS, HAIR_STYLES, SKIN_COLORS, OUTFIT_COLORS, OUTFIT_TYPES, ACCESSORIES,
} from '@/lib/character-state';

export default function CharacterBuilder({ character, onChange }: { character: Character; onChange: (c: Character) => void }) {
  const char = character;

  const update = (field: keyof Character, value: string) => {
    onChange({ ...char, [field]: value });
  };

  return (
    <div style={{
      background: '#fff8f0',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 6px 30px rgba(212,106,106,0.1)',
      maxWidth: '520px',
      margin: '0 auto',
    }}>
      <h2 style={{ color: '#c47a4a', fontSize: '1.8rem', marginBottom: '1.2rem', textAlign: 'center' }}>
        Customize Your Character
      </h2>

      {/* Character Preview */}
      <div style={{
        background: '#ffebd6',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        border: '2px solid #f5d0a9',
      }}>
        <div style={{
          width: 100, height: 140,
          margin: '0 auto',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 30%, #ffe4c4 60%, #f0c8a0 100%)',
          borderRadius: '50px 50px 20px 20px',
          overflow: 'hidden',
          border: '3px solid #d46a6a',
        }}>
          {/* Hair */}
          <div style={{
            position: 'absolute', top: -10, left: 0, right: 0, height: 50,
            background: char.hairColor,
            borderRadius: '50% 50% 0 0',
            clipPath: char.hairStyle === 'long' ? 'ellipse(40% 45% at 50% 30%)' : 'ellipse(45% 50% at 50% 25%)',
            opacity: 0.85,
          }} />
          {/* Skin */}
          <div style={{
            position: 'absolute', top: 40, left: 20, right: 20, height: 60,
            background: char.skinColor,
            borderRadius: '30px',
          }} />
          {/* Outfit */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10, right: 10, height: 50,
            background: char.outfitColor,
            borderRadius: '15px 15px 5px 5px',
          }} />
          {/* Accessory */}
          {char.accessory === 'glasses' && (
            <div style={{
              position: 'absolute', top: 55, left: 30, width: 40, height: 10,
              border: '3px solid #5a3d2b', borderRadius: '10px',
            }} />
          )}
          {char.accessory === 'hat' && (
            <div style={{
              position: 'absolute', top: -5, left: 15, width: 70, height: 25,
              background: '#5a3d2b', borderRadius: '15px 15px 0 0',
            }} />
          )}
          {char.accessory === 'flower' && (
            <div style={{
              position: 'absolute', top: 5, right: 10,
              width: 20, height: 20, background: '#d46a6a', borderRadius: '50%',
            }} />
          )}
        </div>
        <p style={{ fontWeight: 'bold', color: '#8a6d4b', marginTop: '0.5rem' }}>{char.name}</p>
        <p style={{ color: '#c47a4a', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {char.accessory !== 'none' ? `Wearing ${char.accessory}` : 'No accessory'}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Field label="Name" value={char.name} onChange={v => update('name', v)} />
        <ColorField label="Hair Color" value={char.hairColor} options={HAIR_COLORS} onChange={v => update('hairColor', v)} />
        <SelectField label="Hair Style" value={char.hairStyle} options={HAIR_STYLES} onChange={v => update('hairStyle', v)} />
        <ColorField label="Skin Color" value={char.skinColor} options={SKIN_COLORS} onChange={v => update('skinColor', v)} />
        <ColorField label="Outfit Color" value={char.outfitColor} options={OUTFIT_COLORS} onChange={v => update('outfitColor', v)} />
        <SelectField label="Outfit Type" value={char.outfitType} options={OUTFIT_TYPES} onChange={v => update('outfitType', v)} />
        <SelectField label="Accessory" value={char.accessory} options={ACCESSORIES} onChange={v => update('accessory', v)} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: '0.85rem', color: '#8a6d4b', fontWeight: 600 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.75rem',
          border: '2px solid #f5d0a9', background: '#fff', fontSize: '1rem',
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = '#d46a6a')}
        onBlur={e => (e.target.style.borderColor = '#f5d0a9')}
      />
    </div>
  );
}

function ColorField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: '0.85rem', color: '#8a6d4b', fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: opt,
              border: value === opt ? '3px solid #d46a6a' : '2px solid #e8c5a0',
              cursor: 'pointer', transition: 'transform 0.1s',
              boxShadow: value === opt ? '0 2px 6px rgba(212,106,106,0.3)' : 'none',
            }}
            aria-label={opt}
          />
        ))}
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: '0.85rem', color: '#8a6d4b', fontWeight: 600 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.75rem',
          border: '2px solid #f5d0a9', background: '#fff', fontSize: '1rem',
          marginTop: '0.4rem', cursor: 'pointer',
        }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
      </select>
    </div>
  );
}
