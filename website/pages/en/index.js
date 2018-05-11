/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo" style={{display: 'none'}}>
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('fastpack.svg')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('get-started.html')}>Get Started</Button>
            <Button href="https://github.com/fastpack/fastpack">Github</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    id={props.id}
    background={props.background}>
    <GridBlock contents={props.children} layout={props.layout} />
  </Container>
);

const why = `
- JavaScript bundling can be faster
- We can critically re-think the building infrastructure
- We have proper tools
- Writing OCaml is fun!
`;

const benchmarks = `
**1602 modules / 5.8Mb / MB Pro 2015**
|                       |Fastpack|Webpack|Parcel<sup>*</sup>
|-----------------------|:------:|:-----:|:----:
|initial build          | **2.148s**  | 6.113s | 24.32s
|- [persistent cache](${docUrl('persistent-cache.html')}) | **0.176s**  | N/A | 14.88s
|- watch mode   | **0.074s**  | 0.612s  | 0.354s
<small style="font-size: 0.7em;"><sup>*</sup>We are unsure if Parcel can be configured?<br/></small>
[More on benchmarks...](${docUrl('benchmarks.html')})
`;

const pre = "```";
const install = `
${pre}Bash
$ npm install -g fpack
$ fpack --help
${pre}
`;

const Features = props => (
  <Block layout="threeColumn" background="inherit">
    {[
      {
        content: why,
        title: 'Why?',
      },
      {
        content: benchmarks,
        title: 'Show me benchmarks...',
      },
      {
        content: install,
        title: 'I want to try!',
      },
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = Index;
