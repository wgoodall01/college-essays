import React from 'react';
import saveAs from 'file-saver';
import {renderToStaticMarkup} from 'react-dom/server';

// This makes Word insert a page break.
const PageBreak = () => <br style={{pageBreakBefore: 'always'}} />;

// This paragraph-izes text.
//   - First: replaces \n\n with a <p>
//   - Second: replaces any \n with a <br>
const Paragraph = ({children}) => {
  const text = children || '';
  let paragraphs = text.split('\n\n').map(para => para.split('\n'));

  return paragraphs.map((para, i) => (
    <p key={i}>
      {para.map((line, j) => (
        <React.Fragment key={j}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </p>
  ));
};

const TitlePage = ({title, date}) => (
  <React.Fragment>
    <h1 style={{marginTop: '300px'}}>{title}</h1>
    <p>
      on {date.toLocaleDateString()}, {date.toLocaleTimeString()}
    </p>
    <PageBreak />
  </React.Fragment>
);

const InfoBox = ({children, name}) => (
  <React.Fragment>
    <div
      style={{
        fontSize: '16px',
        fontWeight: 'normal',
        marginBottom: '0',
        color: '#555'
      }}
    >
      {name}
    </div>
    {children}
    <hr />
  </React.Fragment>
);

const Essay = ({essay}) => (
  <React.Fragment>
    <h1>{essay['Name']}</h1>

    {essay['Prompt'] && (
      <InfoBox name="Prompt">
        <Paragraph>{essay['Prompt']}</Paragraph>
      </InfoBox>
    )}

    {essay['Brainstorming'] && (
      <InfoBox name="Brainstorming">
        <Paragraph>{essay['Brainstorming']}</Paragraph>
      </InfoBox>
    )}

    {essay['Attachments'] && (
      <InfoBox name="Attachments">
        <ul>
          {essay['Attachments'].map((a, i) => (
            <li key={i}>
              <a href={a.url}>{a.filename}</a>
            </li>
          ))}
        </ul>
      </InfoBox>
    )}

    <div style={{marginTop: '20px'}}>
      <Paragraph>{essay['Essay']}</Paragraph>
    </div>

    <PageBreak />
  </React.Fragment>
);

const pageStyles = {
  fontFamily: 'Helvetica',
  maxWidth: '700px',
  lineHeight: '1.3em'
};

export async function generate({essays, date}) {
  const report = (
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <title>College Essays</title>
      </head>
      <body style={pageStyles}>
        <TitlePage title="College Essays" date={date || new Date()} />
        {essays.filter(e => (e.fields['Essay'] || '').trim().length > 0).map(e => (
          <Essay essay={e.fields} key={e.id} />
        ))}
      </body>
    </html>
  );

  const html = renderToStaticMarkup(report);
  return html;
}

export async function save(text, filename) {
  const blob = new Blob([text], {type: 'text/html;charset=utf-8'});
  saveAs(blob, filename);
}
