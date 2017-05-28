import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';
import { Slides } from '/imports/api/slides.js';

// SlidesInsert component - button to append slides to last slide
class SlidesInsert extends Component {
  constructor() {
    super()
    this.parseImport = this.parseImport.bind(this);
  }
  componentDidMount() {
    PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
  }
  storePdfSlides(slides) {
    // store all the slides after the active slide
    const location = Slides.activeSlide('number') || 0;
    const offset = slides.length || 0;
    Meteor.call('slides.offset', offset);
    slides.forEach((slide, number) => {
      const canvas = document.createElement('canvas');
      const scale = 1.5;
      const viewport = slide.getViewport(scale);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const task = slide.render({ canvasContext: context, viewport: viewport });
      task.promise.then(function() {
        Meteor.call('slides.insert', location, {
          number: number + 1, /*index should be 1, not 0*/
          data: canvas.toDataURL('image/png'),
        });
      });
    });
  }
  parsePdf(pdf) {
    const slides = [];
    _.times(pdf.numPages, (pageNum) => {
      // index should be 1, not 0
      slides.push(pdf.getPage(pageNum + 1));
    });
    Promise.all(slides).then((slides) => this.storePdfSlides(slides));
  }
  parseImport(event) {
    const slides = event.target.files[0];
    if(!slides) return;
    // check if image or pdf, assume pdf for now
    const slidesUrl = URL.createObjectURL(slides);
    PDFJS.getDocument(slidesUrl).then(this.parsePdf.bind(this), (error) => console.log(error));
  }

  render() {
    return (
      <a className="flex-row w3-padding-0 w3-section w3-text-teal">
        <label>
          <input 
            className="import-button" 
            type="file" 
            accept=".pdf,.jpg,.png," 
            style={{display: "none"}}
            onChange={this.parseImport}
          />
         {/*stacked icon: arrow down over single slide*/}
          <i className="fa-arrow-down fa fa-lg fa-fw w3-margin-right"/>
          Insert
        </label>
      </a>
    );
  }
}
SlidesInsert.propTypes = {};

export default createContainer(() => {
  return {};
}, SlidesInsert);
