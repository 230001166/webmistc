import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState';

// ClearSlideButton component - button for clearing notes off the current slide
class ClearSlideButton extends Component {
  toggleOptionsMenu(){
    AppState.set('erase_slide_menu_open', !this.props.erase_slide_menu_open)
  }
  clearSlide(){
    Meteor.call('erase.slide');
    this.toggleOptionsMenu();
  }
  clearPresentation(){
    Meteor.call('erase.presentation');
    this.toggleOptionsMenu();
  }
  render() {
    const options = classNames(
      'menu__item-dropdown--clear-slide w3-dropdown-content w3-white w3-card-4', {
      'w3-show': this.props.erase_slide_menu_open,
    });
    const cancel = 'fa-times-circle fa w3-large w3-text-pink';
    const confirm = 'fa-check-circle fa w3-large w3-text-green';
    const clearPresentation = 'fa-exclamation-circle fa w3-large w3-text-red';
    return (
      <span className='roles-menu w3-dropdown-click' data-tip='Clear Slide'>
        <span className='menu__item flex-row' onClick={()=>this.toggleOptionsMenu()}>
          <span className='menu__item-button flex-row flex-row--center'>
            <span className='notes-menu__clear-slide fa-stack fa-fw'>
              <i className='fa fa-sticky-note-o fa-stack-2x'></i>
              <i className='fa fa-eraser fa-stack-1x'></i>
            </span>
          </span>
          <span className='menu__item-description'>Clear Slide</span>
        </span>
        <div className={options}>
          <span className='flex-row flex-row--ends w3-padding-medium'>
            <i className={cancel} onClick={()=>this.toggleOptionsMenu()}/>
            <i className={confirm} onClick={()=>this.clearSlide()}/>
            <i className={clearPresentation} onClick={()=>this.clearPresentation()}/>
          </span>
        </div>
      </span>
    );
  }
} 
 
ClearSlideButton.propTypes = {
  erase_slide_menu_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    erase_slide_menu_open: AppState.get('erase_slide_menu_open'),
  };
}, ClearSlideButton);