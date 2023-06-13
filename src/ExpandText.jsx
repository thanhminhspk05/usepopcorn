import { useState } from 'react';

export default function ExpandText() {
  return (
    <div>
      <TextExpander
        collapsedNumWords={20}
        expandButtonText="Show text"
        collapseButtonText="Collapse text"
        buttonColor="#ff6622"
        expanded={true}
        className="box"
      >
        Space travel requires some seriously amazing technology and collaboration between countries, private companies,
        and international space organizations. And while it's not always easy (or cheap), the results are out of this
        world. Think about the first time humans stepped foot on the moon or when rovers were sent to roam around on
        Mars.
      </TextExpander>
    </div>
  );
}

function TextExpander({
  expanded = false,
  className = '',
  collapsedNumWords = 15,
  expandButtonText = 'Show more',
  collapseButtonText = 'Show less',
  buttonColor = '#000',
  children,
}) {
  const [isExpand, setIsExpand] = useState(expanded);
  const getTextByNumWords = children.split(' ').slice(0, collapsedNumWords).join(' ');

  return (
    <div
      style={{ marginTop: '10px' }}
      className={className}
    >
      <div>
        {isExpand ? children : `${getTextByNumWords}...`}
        <button
          style={{ color: buttonColor }}
          onClick={() => setIsExpand(!isExpand)}
        >
          {isExpand ? collapseButtonText : expandButtonText}
        </button>
      </div>
    </div>
  );
}
