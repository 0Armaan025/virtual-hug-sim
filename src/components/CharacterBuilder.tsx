"use client";
import { Character, Gender } from '@/types';
import CharacterSprite from './CharacterSprite';
import {
  HAIR_COLORS, HAIR_STYLES, SKIN_COLORS, OUTFIT_COLORS, OUTFIT_TYPES_BY_GENDER, ACCESSORIES,
} from '@/lib/character-state';

const GENDERS: { id: Gender; label: string; icon: string }[] = [
  { id: 'female', label: 'Female', icon: '♀' },
  { id: 'male', label: 'Male', icon: '♂' },
  { id: 'nonbinary', label: 'Non-binary', icon: '⚧' },
];

const ACC_ICONS: Record<string, string> = {
  none: '—', glasses: '👓', sunglasses: '🕶', hat: '🎩', beanie: '🧢',
  headphones: '🎧', bow: '🎀', flower: '🌸', scarf: '🧣', earrings: '💎', mask: '😷',
};

export default function CharacterBuilder({ character, onChange }: { character: Character; onChange: (c: Character) => void }) {
  const set = (patch: Partial<Character>) => onChange({ ...character, ...patch });
  const hairStyles = HAIR_STYLES[character.gender];
  const outfitTypes = OUTFIT_TYPES_BY_GENDER[character.gender];

  return (
    <section style={{
      background: 'linear-gradient(165deg, rgba(255,255,255,.055), rgba(255,255,255,.02))',
      border: '1px solid rgba(255,255,255,.09)', borderRadius: 28,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 24px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.09)',
      padding: '1.75rem', maxWidth: 560, margin: '0 auto',
    }}>
      <header style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Design your avatar</h2>
        <p style={{ margin: '.35rem 0 0', fontSize: '.85rem', color: 'rgba(245,235,230,.55)' }}>Everything updates live in the room</p>
      </header>

      {/* Preview */}
      <div style={{
        position: 'relative', borderRadius: 22, padding: '1.25rem', marginBottom: '1.5rem',
        background: 'radial-gradient(circle at 50% 82%, rgba(224,83,122,.22), rgba(90,122,224,.12) 45%, transparent 72%), rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.07)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem',
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 22, background: 'radial-gradient(circle at 50% 100%, rgba(255,143,163,.18), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ animation: 'bobPreview 3.4s ease-in-out infinite' }}>
          <CharacterSprite character={character} />
        </div>
        <p style={{ margin: '.35rem 0 0', fontWeight: 800, fontSize: '1rem' }}>{character.name || 'Unnamed'}</p>
        <p style={{ margin: 0, fontSize: '.72rem', color: 'rgba(245,235,230,.45)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          {GENDERS.find(g => g.id === character.gender)?.label} · {character.outfitType} · {character.hairStyle}
        </p>
      </div>
      <style>{`@keyframes bobPreview{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

      {/* Gender */}
      <Field label="Identity">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {GENDERS.map(g => (
            <button key={g.id} onClick={() => set({ gender: g.id })} style={{
              padding: '.7rem .4rem', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
              border: character.gender === g.id ? '1px solid rgba(255,143,163,.7)' : '1px solid rgba(255,255,255,.08)',
              background: character.gender === g.id ? 'linear-gradient(160deg,rgba(224,83,122,.28),rgba(224,83,122,.08))' : 'rgba(255,255,255,.03)',
              color: 'inherit', transition: 'all .18s',
            }}>
              <div style={{ fontSize: '1.15rem', lineHeight: 1 }}>{g.icon}</div>
              <div style={{ fontSize: '.72rem', fontWeight: 700, marginTop: 4, opacity: character.gender === g.id ? 1 : .6 }}>{g.label}</div>
            </button>
          ))}
        </div>
      </Field>

      {/* Name */}
      <Field label="Name">
        <input
          value={character.name}
          onChange={e => set({ name: e.target.value.slice(0, 18) })}
          placeholder="Your name"
          style={{
            width: '100%', padding: '.75rem 1rem', borderRadius: 14, fontSize: '.92rem',
            border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)',
            color: '#f5ebe6', outline: 'none', transition: 'border-color .18s', fontFamily: 'inherit',
          }}
        />
      </Field>

      {/* Hair style */}
      <Field label="Hair style">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {hairStyles.map(s => (
            <Chip key={s} active={character.hairStyle === s} onClick={() => set({ hairStyle: s })} label={cap(s)} />
          ))}
        </div>
      </Field>

      {/* Hair color */}
      <Field label="Hair color">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {HAIR_COLORS.map(c => (
            <button key={c} onClick={() => set({ hairColor: c })} aria-label={c} style={{
              width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
              background: `radial-gradient(circle at 32% 28%, ${c}, ${shade(c, -22)})`,
              border: character.hairColor === c ? '2px solid #ff8fa3' : '1px solid rgba(255,255,255,.15)',
              boxShadow: character.hairColor === c ? '0 0 12px rgba(255,143,163,.55)' : 'none',
              transition: 'all .15s',
            }} />
          ))}
        </div>
      </Field>

      {/* Skin */}
      <Field label="Skin tone">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SKIN_COLORS.map(c => (
            <button key={c} onClick={() => set({ skinColor: c })} aria-label={c} style={{
              width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
              background: `radial-gradient(circle at 32% 28%, ${shade(c, 10)}, ${c})`,
              border: character.skinColor === c ? '2px solid #ff8fa3' : '1px solid rgba(255,255,255,.15)',
              boxShadow: character.skinColor === c ? '0 0 12px rgba(255,143,163,.55)' : 'none',
              transition: 'all .15s',
            }} />
          ))}
        </div>
      </Field>

      {/* Outfit */}
      <Field label="Outfit">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {outfitTypes.map(t => (
            <Chip key={t} active={character.outfitType === t} onClick={() => set({ outfitType: t })} label={cap(t)} />
          ))}
        </div>
      </Field>

      {/* Outfit color */}
      <Field label="Outfit color">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {OUTFIT_COLORS.map(c => (
            <button key={c} onClick={() => set({ outfitColor: c })} aria-label={c} style={{
              width: 30, height: 30, borderRadius: 10, cursor: 'pointer',
              background: `linear-gradient(160deg, ${shade(c, 14)}, ${shade(c, -14)})`,
              border: character.outfitColor === c ? '2px solid #ff8fa3' : '1px solid rgba(255,255,255,.15)',
              boxShadow: character.outfitColor === c ? '0 0 12px rgba(255,143,163,.55)' : 'none',
              transition: 'all .15s',
            }} />
          ))}
        </div>
      </Field>

      {/* Accessory */}
      <Field label="Accessory">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {ACCESSORIES.map(a => (
            <button key={a} onClick={() => set({ accessory: a })} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '.45rem .65rem',
              borderRadius: 12, cursor: 'pointer', fontSize: '.72rem', fontWeight: 700,
              border: character.accessory === a ? '1px solid rgba(255,143,163,.7)' : '1px solid rgba(255,255,255,.08)',
              background: character.accessory === a ? 'linear-gradient(160deg,rgba(224,83,122,.28),rgba(224,83,122,.08))' : 'rgba(255,255,255,.03)',
              color: 'inherit', transition: 'all .15s',
            }}>
              <span>{ACC_ICONS[a] ?? '✨'}</span>{cap(a)}
            </button>
          ))}
        </div>
      </Field>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.15rem' }}>
      <p style={{
        margin: '0 0 .5rem', fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '.12em', color: 'rgba(245,235,230,.45)',
      }}>{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '.45rem .8rem', borderRadius: 12, cursor: 'pointer',
      fontSize: '.74rem', fontWeight: 700,
      border: active ? '1px solid rgba(255,143,163,.7)' : '1px solid rgba(255,255,255,.08)',
      background: active ? 'linear-gradient(160deg,rgba(224,83,122,.3),rgba(224,83,122,.08))' : 'rgba(255,255,255,.03)',
      color: active ? '#ffd9e1' : 'rgba(245,235,230,.7)',
      transition: 'all .15s',
    }}>{label}</button>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function shade(hex: string, amt: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}
