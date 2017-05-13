import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
 
import AppState from '/imports/api/appState.js';

import StickyNotesButton from './notes/StickyNotesButton.jsx';
import DrawingButton from './notes/DrawingButton.jsx';
import TextButton from './notes/TextButton.jsx';
import LineButton from './notes/LineButton.jsx';
import ArrowButton from './notes/ArrowButton.jsx';
import CircleButton from './notes/CircleButton.jsx';
import BoxButton from './notes/BoxButton.jsx';
import EraserButton from './notes/EraserButton.jsx';
import ClearSlideButton from './notes/ClearSlideButton.jsx';
import NoteColorButton from './notes/NoteColorButton.jsx';
import NoteSizeButton from './notes/NoteSizeButton.jsx';
import RolesMenuButton from './RolesMenuButton.jsx';
 

// NoteMenu component - note and role options
class NoteMenu extends Component {
  changeNote(property, setting){
    AppState.set({
      [`note_${property}`]: setting,
      'colors_menu_open': false,
      'sizes_menu_open': false,
    });
  }
  render() {
    const noteMenu = classNames(
      'menu menu--notes w3-card-8 w3-animate-left',{
      'w3-show': AppState.get('notes_menu_open'),
    }); 
    const {window_width} = this.props;
    return (
      <nav className={noteMenu}>
        <div className="notes-menu w3-text-teal">
          <StickyNotesButton/>
          <DrawingButton select={this.changeNote}/>
          <TextButton select={this.changeNote}/>
          <LineButton select={this.changeNote}/>
          <ArrowButton select={this.changeNote}/>
          <BoxButton select={this.changeNote}/>
          <CircleButton select={this.changeNote}/>
          <EraserButton select={this.changeNote}/>
          <ClearSlideButton/>
          <NoteColorButton select={this.changeNote}/>
          <NoteSizeButton select={this.changeNote}/>
          <RolesMenuButton/>
        </div>
      </nav>
    );
  }
}

NoteMenu.propTypes = {
  notes_menu_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    notes_menu_open: AppState.get('notes_menu_open'),
    window_height: AppState.get('window_height'),
    window_width: AppState.get('window_width'),
  };
}, NoteMenu);