import { strengths as content } from '../content/portfolio.js'
import SectionHead from './SectionHead.jsx'

const ICONS = ['◉', '◬', '◆', '◐', '◎', '✳']

export default function Strengths() {
  return (
    <section className="section strengths" id="strengths">
      <div className="container">
        <div className="strengths-head">
          <SectionHead no="03" en="CAPABILITIES" zh="个人优势" />
          <div className="strengths-head-right">
            <h2 className="section-title" data-reveal>
              {content.title}，
              <br />
              <span className="section-title-accent">{content.titleAccent}</span>
            </h2>
            <p className="strengths-desc" data-reveal data-delay="120">{content.desc}</p>
          </div>
        </div>

        <div className="skill-grid">
          {content.items.map((s, i) => (
            <article className="skill-card" key={s.title} data-reveal data-delay={(i % 3) * 100}>
              <span className="skill-no">0{i + 1}</span>
              <span className="skill-icon" aria-hidden="true">{ICONS[i]}</span>
              <h3 className="skill-title">{s.title}</h3>
              <p className="skill-desc">{s.desc}</p>
              <ul className="skill-tags">
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
