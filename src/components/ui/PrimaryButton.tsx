import type { MouseEventHandler } from 'react'
import { textStyles } from '../../styles/tokens'

interface PrimaryButtonProps {
  label: string
  href?: string
  variant?: 'brand' | 'white'
  className?: string
  fullWidth?: boolean
  stretch?: boolean
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

export default function PrimaryButton({
  label,
  href,
  variant = 'brand',
  className,
  fullWidth = false,
  stretch = false,
  target,
  rel,
  type = 'button',
  onClick,
}: PrimaryButtonProps) {
  const isThemeAware = className?.split(/\s+/).includes('clarte-button--nav')
  const variantClass = isThemeAware ? '' : ` primary-button--${variant}`
  const classNames = `clarte-button${variantClass}${className ? ` ${className}` : ''}`
  const variantColors = variant === 'white'
    ? { backgroundColor: '#ffffff', color: '#000000' }
    : { backgroundColor: '#CC4D22', color: '#ffffff' }
  const style = {
    ...textStyles.bodySmall,
    alignSelf: stretch ? 'stretch' : 'flex-start',
    width: fullWidth ? '100%' : undefined,
    backgroundColor: isThemeAware ? undefined : variantColors.backgroundColor,
    color: isThemeAware ? undefined : variantColors.color,
  }

  const inner = (
    <>
      <span className="clarte-button-bg" aria-hidden="true" />
      <span className="clarte-button-text-wrap">
        <span className="clarte-button-text">{label}</span>
        <span className="clarte-button-text clarte-button-text-clone" aria-hidden="true">
          {label}
        </span>
      </span>
      <span className="clarte-button-arrow-wrap" aria-hidden="true">
        <span className="clarte-button-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="9,2 15,8 9,14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="clarte-button-arrow clarte-button-arrow-clone">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="9,2 15,8 9,14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classNames}
        target={target}
        rel={rel}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        style={style}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      style={{
        ...style,
        border: 0,
      }}
    >
      {inner}
    </button>
  )
}
