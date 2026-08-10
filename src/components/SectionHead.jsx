export default function SectionHead({ no, en, zh, center = false }) {
  const zhOnly = !no && !en
  return (
    <div className={`section-head ${center ? 'is-center' : ''} ${zhOnly ? 'is-zh-only' : ''}`} data-reveal>
      {no ? <span className="section-head-no">{no}</span> : null}
      {en ? <span className="section-head-en">{en}</span> : null}
      {zh ? <span className="section-head-zh">{zh}</span> : null}
    </div>
  )
}
