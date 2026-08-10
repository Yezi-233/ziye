import { useState } from 'react'
import { site, contact as content } from '../content/portfolio.js'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <footer className="contact" id="contact">
      <div className="container contact-bar">
        <div className="contact-visual">
          <img
            src={content.image}
            alt="勤劳的小蜜蜂，从不畏惧重重困难"
            loading="lazy"
          />
        </div>

        <div className="contact-main">
          <div className="contact-heading">
            <p className="contact-name">{site.name}</p>
            <p className="contact-tag">{content.tagline}</p>
          </div>

          <div className="contact-actions">
            <div className="contact-email-block">
              <span className="contact-email-label">邮箱</span>
              <a className="contact-email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <button type="button" className="contact-copy" onClick={copyEmail}>
              {copied ? '已复制' : '复制邮箱'}
            </button>
          </div>
        </div>
      </div>

      <div className="container contact-foot">
        <span>{content.footer}</span>
        <a href="#about">回到顶部 ↑</a>
      </div>
    </footer>
  )
}
