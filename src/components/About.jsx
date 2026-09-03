import { site, about as content, awards } from '../content/portfolio.js'
import Placeholder from './Placeholder.jsx'

const BOLD_PHRASES = [
  '以机械结构为基石、以智能诊断为视角、以扎实落地为目标',
  '行胜于言，尺寸间的毫厘之差，终将沉淀为技术实力的千丈之台。',
]

function renderParagraph(text) {
  const nodes = []
  let rest = text
  let key = 0
  while (rest.length) {
    let hit = null
    let hitAt = -1
    for (const phrase of BOLD_PHRASES) {
      const at = rest.indexOf(phrase)
      if (at !== -1 && (hitAt === -1 || at < hitAt)) {
        hit = phrase
        hitAt = at
      }
    }
    if (!hit) {
      nodes.push(rest)
      break
    }
    if (hitAt > 0) nodes.push(rest.slice(0, hitAt))
    nodes.push(
      <span className="mark-hl" key={key++}>
        {hit}
      </span>,
    )
    rest = rest.slice(hitAt + hit.length)
  }
  return nodes
}

export default function About() {
  return (
    <>
      <section className="section about about-top" id="about">
        <div className="container about-stage">
          <div className="about-align">
            <div className="about-left" data-reveal>
              <div className="portrait-stack">
                <div className="portrait-bloom" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className={`bloom-flower f${i + 1}`}
                      viewBox="0 0 100 100"
                      style={{ '--i': i }}
                    >
                      <g fill="currentColor">
                        <circle cx="50" cy="24" r="19" />
                        <circle cx="73" cy="37" r="19" />
                        <circle cx="73" cy="63" r="19" />
                        <circle cx="50" cy="76" r="19" />
                        <circle cx="27" cy="63" r="19" />
                        <circle cx="27" cy="37" r="19" />
                        <circle cx="50" cy="50" r="17" />
                      </g>
                    </svg>
                  ))}
                </div>
                <div className="portrait-frame">
                  <Placeholder
                    src={content.avatar}
                    alt={`${site.name}头像`}
                    ratio="3 / 4"
                    label="头像 / 人物图"
                    hint="public/images/avatar.png"
                  />
                  <span className="portrait-caption">
                    {site.name} · {site.identity}
                  </span>
                </div>
              </div>
            </div>

            <div className="about-core">
              <h2 className="about-title" data-reveal>
                {content.introTitle}
                <br />
                <em className="about-title-motto">{content.introAccent}</em>
              </h2>

              <ul className="about-tags" data-reveal>
                {content.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              {content.paragraphs.map((p, i) => (
                <p className="about-text" key={i} data-reveal data-delay={i * 100}>
                  {renderParagraph(p)}
                </p>
              ))}

              <div className="about-skills" data-reveal>
                <h3 className="about-skills-title">个人技术能力</h3>
                <ul className="about-skills-list">
                  {content.skills.map((skill) => (
                    <li key={skill.label}>
                      <span className="about-skills-label">{skill.label}</span>
                      <span className="about-skills-chips">
                        {skill.items.map((item) => (
                          <span className="about-skill-chip" key={item}>{item}</span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="about-awards" data-reveal>
            <h3 className="about-awards-title">成绩与获奖情况</h3>
            <div className="stats">
              {content.stats.map((s, i) => (
                <div className="stat" key={s.label} data-reveal data-delay={i * 90}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                  {s.note ? <span className="stat-note">{s.note}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="awards" aria-label={awards.title}>
        <div className="container">
          <h3 className="awards-title" data-reveal>{awards.title}</h3>
        </div>
        <div className="awards-marquee" data-reveal aria-label="奖状滚动展示">
          <div className="awards-track">
            <div className="awards-group">
              {awards.certificates.map((item) => (
                <figure className="awards-card" key={item.src}>
                  <img src={item.src} alt={item.title} loading="lazy" draggable="false" />
                </figure>
              ))}
            </div>
            <div className="awards-group" aria-hidden="true">
              {awards.certificates.map((item) => (
                <figure className="awards-card" key={`dup-${item.src}`}>
                  <img src={item.src} alt="" loading="lazy" draggable="false" />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
