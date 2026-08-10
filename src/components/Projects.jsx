import { projects } from '../content/portfolio.js'
import SectionHead from './SectionHead.jsx'
import Placeholder from './Placeholder.jsx'

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="projects-head">
          <div>
            <SectionHead no="02" en="SELECTED WORKS" zh="精选项目" />
            <h2 className="section-title" data-reveal>
              近期的<span className="section-title-accent">代表作品</span>
            </h2>
          </div>
          <p className="projects-note" data-reveal data-delay="120">
            基于真实项目叙事整理。将作品图放入 public/images/projects/ 后即可替换占位。
          </p>
        </div>

        <div className="proj-grid">
          {projects.map((p, i) => (
            <article className={`proj-card is-${p.span}`} key={p.title} data-reveal data-delay={(i % 2) * 120}>
              <div className="proj-media">
                <Placeholder
                  src={p.image}
                  alt={p.title}
                  ratio={p.ratio}
                  hue={p.hue}
                  label={p.title}
                  hint={p.image}
                />
                <span className="proj-year">{p.year}</span>
                <span className="proj-cat">{p.category}</span>
              </div>
              <div className="proj-body">
                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-foot">
                  <ul className="proj-tags">
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <span className="proj-link">查看案例 →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
