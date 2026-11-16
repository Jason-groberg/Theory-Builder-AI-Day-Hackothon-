import { MathfieldElement } from 'mathlive'
import 'mathlive/fonts.css'
import { useEffect, useRef } from 'react'

// Fonts come from the bundled stylesheet above; keypress sounds are off.
MathfieldElement.fontsDirectory = null
MathfieldElement.soundsDirectory = null

interface Props {
  value: string
  onChange: (latex: string) => void
  label: string
  autoFocus?: boolean
}

/** A visual equation editor. Users build expressions directly; the value is LaTeX. */
export function MathField({ value, onChange, label, autoFocus }: Props) {
  const ref = useRef<MathfieldElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && el.value !== value) el.value = value
  }, [value])

  useEffect(() => {
    if (!autoFocus) return
    // The field finishes setting itself up after it is attached, so wait a frame.
    const frame = requestAnimationFrame(() => ref.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [autoFocus])

  return (
    <math-field
      ref={ref}
      aria-label={label}
      onInput={(e) => onChange((e.target as MathfieldElement).value)}
    />
  )
}
