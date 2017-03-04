import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import { DummyText } from '../../../api/dummyText.js';
import Draggable from 'react-draggable';
import ReactTooltip from 'react-tooltip';

import { AppState } from '../../../api/appState.js';


import Whiteboard from '../components/Whiteboard.jsx';
import MuteButton from '../components/MuteButton.jsx';
import FullscreenButton from '../components/MuteButton.jsx';


export default class App extends Component {
  constructor(props) {
    super(props);

    /*
    nested state is an anti-pattern, try pseudo-namespaces, 
    i.e. this.state.notes_menuOpened, this.state.notes_sticky
    */
 
    this.state = {
      mic: {
        muted: false,
      },
      notes: {
        menuOpened: false,
        sticky: true,
      },
      panels: {
        menuOpened: false,
        showing: {
          questions: false,
          chat: false,
          message: false,
          roles: false,
          sound: false,
          presentationControl: false,
          importExport: false,
          vote: false,
        },
      },
      roles: {
        menuOpened: false,
        attendee: true,
        contributor: false,
        presenter: false,
        admin: false,
        sortBy: {
          attendee: true,
          contributor: false,
          presenter: false,
          admin: false,
        }
      },
      colors: {
        menuOpened: false,
        options: {
          purple: false,
          blue: true,
          orange: false,
          green: false,
          red: false
        }
      },
      sizes: {
        menuOpened: false,
        options: {
          tiny: false,
          small: false,
          medium: true,
          large: false,
          huge: false,
        }
      },
      soundTest: {
        testing: false,
      },
      record: {
        recording: false,
        paused: false,
      },
      playback: {
        playing: false,
      }, 
      messages: {
        listOpened: false,
        recipient: undefined,
      },
      voting: {
        listOpened: false,
        poll: undefined,
        started: false,
      },
      slides: {
        menuOpened: false,
        active: {
          slide1: true,
          slide2: false,
          slide3: false,
          slide4: false,
          slide5: false,
          slide6: false,
        }
      },
      whiteboard: {
        fullscreen: false,
      },
      tool: {
        type: 'draw',
        color: 'blue',
        size: 'medium',
      },
      window: {
        width: undefined,
        height: undefined,
      }
    };
  }
  changeTool(property, setting){
    // TODO: remove template literal after extracting components
    // remember to change the refs, e.g. from type -> tool_type
    // onClick={this.changeTool.bind(this, 'type', 'text')} to
    // onClick={this.changeTool.bind(this, 'tool_type', 'text')}
    AppState.set(`tool_${property}`, setting);
    _.merge(this.state.tool,
      { [property]: setting }
    );
    this.setState(this.state);
  }

  updateWindowDimensions() {
    if (Meteor.isClient) {
      _.merge(this.state.window, { width: $(window).width(), height: $(window).height() });
      this.setState(this.state);
    }
  }

  componentWillMount() {
    this.updateWindowDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  toggleFullscreen(){
    AppState.toggle('whiteboard_fullscreen');
    _.merge(this.state.whiteboard, { fullscreen: !this.state.whiteboard.fullscreen });
    this.setState(this.state);
  }

  toggleSoundTest(){
    _.merge(this.state.soundTest, { testing: !this.state.soundTest.testing });
    this.setState(this.state);
  }

  toggleStickyNotes(){
    _.merge(this.state.notes, { sticky: !this.state.notes.sticky });
    this.setState(this.state);
  }
  toggleRoleDropdown(){
    _.merge(this.state.roles, { menuOpened: !this.state.roles.menuOpened });
    this.setState(this.state);
  }
  toggleColorsDropdown(){
    _.merge(this.state.colors, { menuOpened: !this.state.colors.menuOpened });
    this.setState(this.state);
  }
  changeColor(color){
    _.merge(this.state.colors.options,
      { 
        purple: false,
        blue: false,
        orange: false,
        green: false,
        red: false,
      },
      { [color]: true }
    );
    this.changeTool('color', color);
    this.toggleColorsDropdown();
  }
  changeSize(size){
    _.merge(this.state.sizes.options,
      { 
        tiny: false,
        small: false,
        medium: false,
        large: false,
        huge: false,
      },
      { [size]: true }
    );
    this.changeTool('size', size);
    this.toggleSizesDropdown();
  }
  toggleSizesDropdown(){
    _.merge(this.state.sizes, { menuOpened: !this.state.sizes.menuOpened });
    this.setState(this.state);
  }
  toggleMessageRecipients(){
    _.merge(this.state.messages, { listOpened: !this.state.messages.listOpened });
    this.setState(this.state);
  }
  changeRecipient(recipient){
    _.merge(this.state.messages, { recipient });
    this.toggleMessageRecipients();
  }
  togglePollList(){
    _.merge(this.state.voting, { listOpened: !this.state.voting.listOpened });
    this.setState(this.state);
  }
  togglePoll(){
    _.merge(this.state.voting, { started: !this.state.voting.started });
    this.setState(this.state);
  }
  changePoll(poll){
    _.merge(this.state.voting, { poll });
    this.togglePollList();
  }
  changeRole(role){
    _.merge(this.state.roles,
      { 
        attendee: false, 
        contributor: false,
        presenter: false,
        admin: false,
      },
      { [role]: true }
    );
    this.toggleRoleDropdown();
  }
  togglePanel(id){
    let showing = _.mapValues(this.state.panels.showing, (isShowing, panel) => {
      return (panel === id && isShowing === false) ? true : false;
    });
    _.merge(this.state.panels.showing, showing);
    this.setState(this.state);
  }
  getRole(){
    let role;
    if(this.state.roles.attendee){role = 'Attendee';}
    else if(this.state.roles.contributor){role = 'Contributor';}
    else if(this.state.roles.presenter){role = 'Presenter';}
    else if(this.state.roles.admin){role = 'Admin';}
    return role;
  }

  closeMenus(){
    _.merge(this.state.notes, { menuOpened: false });
    _.merge(this.state.panels, { 
      menuOpened: false, 
      showing: {
        questions: false,
        chat: false,
        message: false,
        roles: false,
        sound: false,
        presentationControl: false,
        importExport: false,
        vote: false,
    }});
    _.merge(this.state.roles, { menuOpened: false });
    _.merge(this.state.slides, { menuOpened: false });
    this.setState(this.state);
  }

  toggleNoteMenu(){
     _.merge(this.state.notes, { menuOpened: !this.state.notes.menuOpened });
     this.setState(this.state);
  }

  togglePanelMenu(){
    _.merge(this.state.panels, { menuOpened: !this.state.panels.menuOpened });
    this.setState(this.state);
  }

  toggleRecord(){
    _.merge(this.state.record, { recording: !this.state.record.recording });
    this.setState(this.state);
  }

  toggleResume(){
    _.merge(this.state.record, { paused: !this.state.record.paused });
    this.setState(this.state);
  }

  togglePlayback(){
    _.merge(this.state.playback, { playing: !this.state.playback.playing });
    this.setState(this.state);
  }
  sortRolesBy(role){
    _.merge(this.state.roles.sortBy,
      { 
        attendee: false, 
        contributor: false,
        presenter: false,
        admin: false,
      },
      { [role]: true }
    );
    this.setState(this.state);
  }
  toggleSlideNav(){
    _.merge(this.state.slides, { menuOpened: !this.state.slides.menuOpened });
    this.setState(this.state);
  }
  changeSlide(slide){
    _.merge(this.state.slides.active,
      { 
        slide1: false,
        slide2: false,
        slide3: false,
        slide4: false,
        slide5: false,
        slide6: false,
      },
      { [slide]: true }
    );
    this.setState(this.state);
  }
  moveSlide(direction){
    // per lodash, (iteration order is not guaranteed, so this may break
    let slidesArray = _.toPairs(this.state.slides.active);
    const activeSlideIndex = _.findIndex(slidesArray, (slide) => slide[1] );
    try {
      if (_.isEqual(direction, 'left') ){
        var moveDir = -1;
      } else if (_.isEqual(direction, 'right') ){
        var moveDir = 1;
      }
      slidesArray[activeSlideIndex + moveDir][1] = true;
      slidesArray[activeSlideIndex][1] = false;
    } catch (error) {
      // there isn't a next or previous, so change nothing
    }
    const slidesObject = _.fromPairs(slidesArray);
    _.merge(this.state.slides.active, slidesObject);
    this.setState(this.state);
  }
  render() {
   
    const noteMenu = classNames(
      'menu menu--notes w3-card-8 w3-animate-left',{
      'w3-show': this.state.notes.menuOpened,
    });
    const noteMenuButton = 'notes-menu-btn w3-opennav w3-btn w3-btn-floating-large ripple w3-teal w3-card-2 w3-hide-large w3-text-white';
    
    const panelMenu = classNames(
      'menu menu--panels w3-sidenav w3-card-8 w3-white w3-animate-right', {
      'w3-show': this.state.panels.menuOpened,
    });
    const panelMenuButton = 'panels-menu-btn w3-btn w3-btn-floating-large ripple w3-teal w3-card-2 w3-hide-large w3-text-white';
    const overlay = classNames(
      'overlay w3-animate-opacity', {
      'w3-hide': !this.state.notes.menuOpened && !this.state.panels.menuOpened && !this.state.slides.menuOpened,
      'w3-show': this.state.notes.menuOpened || this.state.panels.menuOpened || this.state.slides.menuOpened,
    });
    const stickyNotesButton = classNames(
      'fa fa-lg fa-fw', {
      'fa-toggle-on w3-text-green': this.state.notes.sticky,
      'fa-toggle-off w3-text-pink': !this.state.notes.sticky,
    });  
    const roleMenuButton = classNames(
      'menu__item flex-row', {
      'w3-text-deep-orange': this.state.roles.attendee,
      'w3-text-green': this.state.roles.contributor,
      'w3-text-blue': this.state.roles.presenter,
      'w3-text-pink': this.state.roles.admin,
    });  
    const colorMenuButton = classNames(
      'fa-circle fa fa-fw w3-large', {
      'w3-text-purple': this.state.colors.options.purple,
      'w3-text-light-blue': this.state.colors.options.blue,
      'w3-text-orange': this.state.colors.options.orange,
      'w3-text-green': this.state.colors.options.green,
      'w3-text-red': this.state.colors.options.red,
    });
    const sizeMenuButton = classNames(
      'fa-circle fa fa-fw w3-text-grey', {
      'note-size--tiny': this.state.sizes.options.tiny,
      'note-size--small': this.state.sizes.options.small,
      'note-size--medium': this.state.sizes.options.medium,
      'note-size--large': this.state.sizes.options.large,
      'note-size--huge': this.state.sizes.options.huge,
    });

    const colorMenuOptions = classNames(
      'menu__item-dropdown--colors w3-dropdown-content w3-white w3-card-4', {
      'w3-show': this.state.colors.menuOpened,
    });

    const sizeMenuOptions = classNames(
      'menu__item-dropdown--sizes w3-dropdown-content w3-white w3-card-4', {
      'w3-show': this.state.sizes.menuOpened,
    });

    const roleMenuOptions = classNames(
      'menu__item-dropdown--roles w3-dropdown-content w3-white w3-card-4', {
      'w3-show': this.state.roles.menuOpened,
    });
    ////////////////////
    const questions = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.questions,
    });
    const chat = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.chat,
    });
    const message = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.message,
    });
    const roles = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.roles,
    });
    const sound = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.sound,
    });
    const presentationControl = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.presentationControl,
    });
    const importExport = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.importExport,
    });
    const vote = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !this.state.panels.showing.vote,
    });
    const soundSettings = {
      muteButton: classNames(
        'w3-btn w3-text-white', {
        'w3-light-green': !this.state.mic.muted,
        'w3-pink': this.state.mic.muted,
      }),
      muteButtonIcon: classNames(
        'fa fa-lg w3-margin-right', {
        'fa-microphone': !this.state.mic.muted,
        'fa-microphone-slash': this.state.mic.muted,
      }),
      testButton: 'flex-row w3-padding-0 w3-section w3-text-teal',
      testButtonIcon: classNames(
        'fa fa-lg w3-margin-right', {
        'fa-cogs': !this.state.soundTest.testing,
        'fa-cog fa-spin': this.state.soundTest.testing,
      }),
    }
    const record = {
      recordingButton: classNames(
        'w3-btn w3-text-white w3-margin-right', {
        'w3-cyan': !this.state.record.recording,
        'w3-light-blue': this.state.record.recording,
      }),
      recordingButtonIcon: classNames(
        'fa-circle fa fa-fw fa-lg', {
        'w3-text-white': !this.state.record.recording,
        'w3-text-red': this.state.record.recording,
      }),
      pauseResumeButton: classNames(
        'w3-btn w3-text-white w3-cyan w3-text-white', {
        'w3-disabled': !this.state.record.recording,
      }),
      pauseResumeButtonIcon: classNames(
        'fa fa-fw fa-lg', {
        'fa-pause': !this.state.record.paused,
        'fa-play': this.state.record.paused,
      }),
    }
    const playback = {
      playPauseButton: 'w3-btn w3-text-white w3-cyan w3-text-white w3-margin-right',
      playPauseButtonIcon: classNames(
        'fa fa-fw fa-lg', {
        'fa-play': !this.state.playback.playing,
        'fa-pause': this.state.playback.playing,
      }),
    }
    const messages = {
      list: classNames(
        '.messages__recipient-list w3-text-teal w3-dropdown-content w3-card-4', {
        'w3-show': this.state.messages.listOpened,
      }),
    }
    const voting = {
      polls: classNames(
        'voting-polls w3-dropdown-content w3-card-4 w3-container', {
        'w3-show': this.state.voting.listOpened,
      }),
      startedButtonIcon: classNames(
        'fa fa-lg fa-fw w3-margin-right', {
        'fa-play': !this.state.voting.started,
        'fa-stop': this.state.voting.started,
      }),
    }
    
    const roleControl = {
      sortBy: {
        attendee: classNames({
          'w3-show': this.state.roles.sortBy.attendee,
          'w3-hide': !this.state.roles.sortBy.attendee,
        }),
        contributor: classNames({
          'w3-show': this.state.roles.sortBy.contributor,
          'w3-hide': !this.state.roles.sortBy.contributor,
        }),
        presenter: classNames({
          'w3-show': this.state.roles.sortBy.presenter,
          'w3-hide': !this.state.roles.sortBy.presenter,
        }),
        admin: classNames({
          'w3-show': this.state.roles.sortBy.admin,
          'w3-hide': !this.state.roles.sortBy.admin,
        }),
      },
      tab: {
        attendee: classNames(
          'w3-btn w3-deep-orange', {
          'w3-opacity-max': !this.state.roles.sortBy.attendee,
        }),
        contributor: classNames(
          'w3-btn w3-green', {
          'w3-opacity-max': !this.state.roles.sortBy.contributor,
        }),
        presenter: classNames(
          'w3-btn w3-blue', {
          'w3-opacity-max': !this.state.roles.sortBy.presenter,
        }),
        admin: classNames(
          'w3-btn w3-pink', {
          'w3-opacity-max': !this.state.roles.sortBy.admin,
        }),
      }
    }

    const slideNav = classNames(
      'menu--slide-nav menu w3-animate-bottom', {
      'w3-show': this.state.slides.menuOpened,
    });

    const slideThumbnail = {
      slide1: classNames(
        'slide-nav__slide clickable w3-margin flex-absolute-center', {
        'w3-white w3-text-grey w3-card-2': !this.state.slides.active.slide1,
        'slide-nav__active w3-teal w3-card-4 w3-padding': this.state.slides.active.slide1,
      }),
      slide2: classNames(
        'slide-nav__slide clickable w3-margin flex-absolute-center', {
        'w3-white w3-text-grey w3-card-2': !this.state.slides.active.slide2,
        'slide-nav__active w3-teal w3-card-4 w3-padding': this.state.slides.active.slide2,
      }),
      slide3: classNames(
        'slide-nav__slide clickable w3-margin flex-absolute-center', {
        'w3-white w3-text-grey w3-card-2': !this.state.slides.active.slide3,
        'slide-nav__active w3-teal w3-card-4 w3-padding': this.state.slides.active.slide3,
      }),
      slide4: classNames(
        'slide-nav__slide clickable w3-margin flex-absolute-center', {
        'w3-white w3-text-grey w3-card-2': !this.state.slides.active.slide4,
        'slide-nav__active w3-teal w3-card-4 w3-padding': this.state.slides.active.slide4,
      }),
      slide5: classNames(
        'slide-nav__slide clickable w3-margin flex-absolute-center', {
        'w3-white w3-text-grey w3-card-2': !this.state.slides.active.slide5,
        'slide-nav__active w3-teal w3-card-4 w3-padding': this.state.slides.active.slide5,
      }),
      slide6: classNames(
        'slide-nav__slide clickable w3-margin flex-absolute-center', {
        'w3-white w3-text-grey w3-card-2': !this.state.slides.active.slide6,
        'slide-nav__active w3-teal w3-card-4 w3-padding': this.state.slides.active.slide6,
      }),
    }

    const fullscreenButton = classNames(
      'fullscreen-btn w3-btn w3-btn-floating-large ripple w3-card-2 w3-text-white w3-teal', {
      'fullscreen-btn--fullscreen': this.state.whiteboard.fullscreen,
    });
    const fullscreenButtonIcon = classNames(
      'fa fa-fw', {
      'fa-expand': !this.state.whiteboard.fullscreen,
      'fa-compress': this.state.whiteboard.fullscreen,
    });

    const whiteboard = classNames(
      'whiteboard tool-type--draw w3-card-4 w3-light-grey', {
      'whiteboard--fullscreen': this.state.whiteboard.fullscreen,
    });

    const chip = classNames(
      'chip w3-opacity w3-teal w3-small w3-slim', {
      'chip--fullscreen': this.state.whiteboard.fullscreen,
    });
    return (
      <div>
        <MuteButton/>
        {/*<button className={fullscreenButton} onClick={this.toggleFullscreen.bind(this)}><i className={fullscreenButtonIcon}/></button>*/}
      {/*<FullscreenButton/>*/}
        {/*<!-- NoteMenu -->*/}
        <button className={noteMenuButton} onClick={this.toggleNoteMenu.bind(this)}><i className="fa-pencil fa fa-fw"/></button>
        <nav className={noteMenu}>
          <div className="notes-menu w3-text-teal">
            <ReactTooltip 
              place="right" 
              class="tooltip" 
              effect="solid" 
              delayShow={1000} 
              disable={ this.state.window.width > 900 ? false : true }
            />
            <span className="menu__item flex-row" data-tip="Sticky Notes" onClick={this.toggleStickyNotes.bind(this)}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className={stickyNotesButton}/>
              </span>
              <span className="menu__item-description">
                Sticky Notes
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Draw">
              <span className="menu__item-button flex-row flex-row--center" onClick={this.changeTool.bind(this, 'type', 'draw')}>
                <i className="fa-pencil fa fa-lg fa-fw"/>
              </span>
              <span className="menu__item-description">
                Draw
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Text">
              <span className="menu__item-button flex-row flex-row--center" onClick={this.changeTool.bind(this, 'type', 'text')}>
                <i className="fa-comment-o fa fa-lg fa-fw"/>
              </span>
              <span className="menu__item-description">
                Text
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Line" onClick={this.changeTool.bind(this, 'type', 'line')}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className="fa-minus fa fa-lg fa-fw fa-rotate-315"/>
              </span>
              <span className="menu__item-description">
                Line
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Arrow" onClick={this.changeTool.bind(this, 'type', 'arrow')}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className="fa-long-arrow-right fa fa-lg fa-fw fa-rotate-315"/>
              </span>
              <span className="menu__item-description">
                Arrow
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Circle" onClick={this.changeTool.bind(this, 'type', 'circle')}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className="fa-circle-thin fa fa-lg fa-fw"/>
              </span>
              <span className="menu__item-description">
                Circle
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Box" onClick={this.changeTool.bind(this, 'type', 'box')}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className="fa-square-o fa fa-lg fa-fw"/>
              </span>
              <span className="menu__item-description">
                Box
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Eraser" onClick={this.changeTool.bind(this, 'type', 'eraser')}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className="fa-eraser fa fa-fw fa-lg"/>
              </span>
              <span className="menu__item-description">
                Eraser
              </span>
            </span>
            <span className="menu__item flex-row" data-tip="Clear Slide">
              <span className="menu__item-button flex-row flex-row--center">
                <span className="notes-menu__clear-slide fa-stack fa-fw">
                  <i className="fa fa-sticky-note-o fa-stack-2x"></i>
                  <i className="fa fa-eraser fa-stack-1x"></i>
                </span>
              </span>
              <span className="menu__item-description">
                Clear Slide
              </span>
            </span>
            <span className='roles-menu w3-dropdown-click' data-tip="Colors">
              <span className="menu__item flex-row" onClick={this.toggleColorsDropdown.bind(this)}>
              <span className="menu__item-button flex-row flex-row--center">
                <i className={colorMenuButton}/>
              </span>
                <span className="menu__item-description">Colors</span>
              </span>
              <div className={colorMenuOptions}>
                <span className="flex-row flex-row--ends w3-padding-medium">
                  <i className="fa-circle fa w3-large w3-text-purple" onClick={this.changeColor.bind(this, "purple")}/>
                  <i className="fa-circle fa w3-large w3-text-light-blue" onClick={this.changeColor.bind(this, "blue")}/>
                  <i className="fa-circle fa w3-large w3-text-orange" onClick={this.changeColor.bind(this, "orange")}/>
                  <i className="fa-circle fa w3-large w3-text-green" onClick={this.changeColor.bind(this, "green")}/>
                  <i className="fa-circle fa w3-large w3-text-red" onClick={this.changeColor.bind(this, "red")}/>
                </span>
              </div>
            </span>
            <span className='roles-menu w3-dropdown-click' data-tip="Sizes">
              <span className="menu__item flex-row" onClick={this.toggleSizesDropdown.bind(this)}>
                <span className="menu__item-button flex-row flex-row--center">
                  <i className={sizeMenuButton}/>
                </span>
                <span className="menu__item-description">Sizes</span>
              </span>
              <div className={sizeMenuOptions}>
                <span className="flex-row flex-row--ends w3-padding-medium">
                  <i className="fa-circle fa note-size--tiny w3-text-grey" onClick={this.changeSize.bind(this, "tiny")}/>
                  <i className="fa-circle fa note-size--small w3-text-grey" onClick={this.changeSize.bind(this, "small")}/>
                  <i className="fa-circle fa note-size--medium w3-text-grey" onClick={this.changeSize.bind(this, "medium")}/>
                  <i className="fa-circle fa note-size--large w3-text-grey" onClick={this.changeSize.bind(this, "large")}/>
                  <i className="fa-circle fa note-size--huge w3-text-grey" onClick={this.changeSize.bind(this, "huge")}/>
                </span>
              </div>
            </span>
            <span className='roles-menu w3-dropdown-click' data-tip={this.getRole()}>
              <span className={roleMenuButton} onClick={this.toggleRoleDropdown.bind(this)}>
                <span className="menu__item-button flex-row flex-row--center">
                  <i className="fa-user fa fa-lg fa-fw"/>
                </span>
                <span className="menu__item-description">
                  {this.getRole()}
                </span>
              </span>
              <div className={roleMenuOptions}>
                <a className="w3-pale-orange w3-padding-medium w3-text-dark-grey" onClick={this.changeRole.bind(this, 'attendee')} href="#">Attendee</a>
                <a className="w3-pale-green w3-padding-medium w3-text-dark-grey" onClick={this.changeRole.bind(this, 'contributor')} href="#">Contributor</a>
                <a className="w3-pale-blue w3-padding-medium w3-text-dark-grey " onClick={this.changeRole.bind(this, 'presenter')} href="#">Presenter</a>
                <a className="w3-pale-red w3-padding-medium w3-text-dark-grey" onClick={this.changeRole.bind(this, 'admin')} href="#">Admin</a>
              </div>
            </span>
          </div>
        </nav>

        {/*<!-- PanelMenu -->*/}
        <button className={panelMenuButton} onClick={this.togglePanelMenu.bind(this)}><i className="fa-th-list fa fa-fw"/></button>
        <nav className={panelMenu} style={{right:0, width: 225 + 'px', padding: 0}}>
          <div className="panels-menu w3-white">
            <span onClick={this.togglePanel.bind(this, 'questions')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-sticky-note-o fa fa-lg fa-fw w3-margin-right"/>Questions
            </span>
            <div className={questions}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'questions')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Questions
                </a>
              </header>
              <main className="panel__content w3-container w3-text-teal">
                <p>What is WebMISTC?</p>
                <p>How do I add questions?</p>
                <p>How do I remove questions?</p>
              </main>
            </div>
            <span onClick={this.togglePanel.bind(this, 'chat')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-bullhorn fa fa-lg fa-fw w3-margin-right"/>Chat
              {/*<span className="w3-badge w3-margin-left w3-pink w3-opacity-min">1</span>*/}
            </span>
            <div className={chat}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'chat')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Group Chat
                </a>
              </header>
              <main className="panel__content w3-container">
                <ul className="w3-ul">
                  <li>
                    <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Hi, everyone!</p>
                  </li>
                  <li>
                    <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Anyone here like Lorem Ipsum text?</p>
                  </li>
                  <li>
                    <p className="w3-slim w3-text-dark-grey"><b>student: </b>Oh yeah!</p>
                  </li>
                  <li>
                    <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>{DummyText}</p>
                  </li>
                </ul>
              </main>
              <footer className="panel__footer">
                <textarea className="w3-input w3-border" placeholder="Enter message..." style={{resize:'none'}}></textarea>
              </footer>
            </div>
            <span onClick={this.togglePanel.bind(this, 'message')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-paper-plane-o fa fa-lg fa-fw w3-margin-right"/>Message
            </span>
            <div className={message}>
              <header className="panel__header w3-container w3-teal">
                <div className="flex-row flex-row--center">
                  <a className="w3-teal" onClick={this.togglePanel.bind(this, 'message')}>
                    <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  </a>
                  <div className="w3-dropdown-click">
                    <button className="w3-btn w3-btn-block w3-cyan w3-text-white" onClick={this.toggleMessageRecipients.bind(this)} >
                      {this.state.messages.recipient || 'Recipients'}
                      <i className="fa-caret-down fa fa-lg fa-fw"/>
                    </button>
                    <div className={messages.list}>
                      <a className="w3-padding-medium" onClick={this.changeRecipient.bind(this, 'dorian')} href="#">Dorian</a>
                      <a className="w3-padding-medium" onClick={this.changeRecipient.bind(this, 'professor')} href="#">Professor</a>
                      <a className="w3-padding-medium" onClick={this.changeRecipient.bind(this, 'student')} href="#">Student</a>
                    </div>
                  </div>
                </div>
                
              </header>
              <main className="panel__content w3-container">
                {this.state.messages.recipient === 'dorian' ? 
                  <ul className="w3-ul">
                    <li>
                      <p className="w3-slim w3-text-dark-grey"><b>self: </b>Hi, Dorian!</p>
                    </li>
                  </ul>
                : ""}
                {this.state.messages.recipient === 'professor' ? 
                  <ul className="w3-ul">
                    <li>
                      <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Hi, Professor!</p>
                    </li>
                    <li>
                      <p className="w3-slim w3-text-dark-grey"><b>professor: </b>Hi, Dorian!</p>
                    </li>
                  </ul>
                : ""}
                {this.state.messages.recipient === 'student' ? 
                  <ul className="w3-ul">
                    <li>
                      <p className="w3-slim w3-text-dark-grey"><b>dorian: </b>Hi, Student!</p>
                    </li>
                    <li>
                      <p className="w3-slim w3-text-dark-grey"><b>student: </b>Hi, Dorian!</p>
                    </li>
                  </ul>
                : ""}
              </main>
              <footer className="panel__footer">
                <textarea className="w3-input w3-border" placeholder="Enter message..." style={{resize:'none'}}></textarea>
              </footer>
            </div>
            <span onClick={this.togglePanel.bind(this, 'roles')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-users fa fa-lg fa-fw w3-margin-right"/>
              Roles
              {/*<span className="w3-badge w3-margin-left w3-pink w3-opacity-min">1</span>*/}
            </span>
            <div className={roles}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'roles')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Audience Roles
                </a>
              </header>
              <main className="panel__content">
                <div className="w3-btn-group">
                  <button className={roleControl.tab.attendee} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'attendee')}>
                    <i className="fa-user fa fa-fw fa-lg "/>
                  </button>
                  <button className={roleControl.tab.contributor} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'contributor')}>
                    <i className="fa-user fa fa-fw fa-lg "/>
                  </button>
                  <button className={roleControl.tab.presenter} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'presenter')}>
                    <i className="fa-user fa fa-fw fa-lg "/>
                  </button>
                  <button className={roleControl.tab.admin} style={{width: 25 + '%'}} onClick={this.sortRolesBy.bind(this, 'admin')}>
                    <i className="fa-user fa fa-fw fa-lg "/>
                  </button>
                </div>
                <section className="w3-container">
                  <div className={roleControl.sortBy.attendee}>
                    <h4 className="w3-text-teal">Sort By Attendee</h4>
                    <p className="w3-text-deep-orange">Student Ace</p>
                    <p className="w3-text-deep-orange">Student First</p>
                    <p className="w3-text-deep-orange">Student One</p>
                    <p className="w3-text-deep-orange">Student Prime</p>
                    <p className="w3-text-deep-orange">Student Solo</p>
                    <p className="w3-text-pink">Dorian</p>
                    <p className="w3-text-blue">Professor</p>
                    <p className="w3-text-green">Guest</p>
                  </div>
                  <div className={roleControl.sortBy.contributor}>
                    <h4 className="w3-text-teal">Sort By Contributor</h4>
                    <p className="w3-text-green">Guest</p>
                    <p className="w3-text-pink">Dorian</p>
                    <p className="w3-text-blue">Professor</p>
                    <p className="w3-text-deep-orange">Student Ace</p>
                    <p className="w3-text-deep-orange">Student First</p>
                    <p className="w3-text-deep-orange">Student One</p>
                    <p className="w3-text-deep-orange">Student Prime</p>
                    <p className="w3-text-deep-orange">Student Solo</p>
                  </div>
                  <div className={roleControl.sortBy.presenter}>
                    <h4 className="w3-text-teal">Sort By Presenter</h4>
                    <p className="w3-text-blue">Professor</p>
                    <p className="w3-text-pink">Dorian</p>
                    <p className="w3-text-green">Guest</p>
                    <p className="w3-text-deep-orange">Student Ace</p>
                    <p className="w3-text-deep-orange">Student First</p>
                    <p className="w3-text-deep-orange">Student One</p>
                    <p className="w3-text-deep-orange">Student Prime</p>
                    <p className="w3-text-deep-orange">Student Solo</p>
                  </div>
                  <div className={roleControl.sortBy.admin}>
                    <h4 className="w3-text-teal">Sort By Admin</h4>
                    <p className="w3-text-pink">Dorian</p>
                    <p className="w3-text-blue">Professor</p>
                    <p className="w3-text-green">Guest</p>
                    <p className="w3-text-deep-orange">Student Ace</p>
                    <p className="w3-text-deep-orange">Student First</p>
                    <p className="w3-text-deep-orange">Student One</p>
                    <p className="w3-text-deep-orange">Student Prime</p>
                    <p className="w3-text-deep-orange">Student Solo</p>
                  </div>
                </section>
              </main>
            </div>
            <span onClick={this.togglePanel.bind(this, 'sound')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-microphone fa fa-lg fa-fw w3-margin-right"/>Sound
            </span>
            <div className={sound}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'sound')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Sound Settings
                </a>
              </header>
              <main className="panel__content w3-container">
                
                <ul className="w3-ul w3-text-teal">
                  <li>
                    <h4>Input Level</h4> 
                    <p className="w3-text-green">RECEIVING</p>
                    <div className="w3-progress-container w3-tiny w3-margin-bottom">
                      <div className="w3-progressbar w3-orange" style={{width:85 + '%'}}></div>
                      <div className="w3-progressbar w3-green" style={{width:75 + '%'}}></div>
                    </div>
                  </li>
                  <li>
                    <h4>Sound Test</h4> 
                    <a className={soundSettings.testButton} onClick={this.toggleSoundTest.bind(this)} href="#!">
                      <i className={soundSettings.testButtonIcon}/>
                      {!this.state.soundTest.testing ? 'Start Test' : 'Testing...'}
                    </a>
                  </li>
                  <li>
                    <h4>Speaker Volume</h4> 
                    <div className="flex-row flex-row--ends w3-margin-bottom">
                      <i className="fa-volume-up fa fa-lg fa-fw w3-margin-right"/>
                      <input style={{width: 100 + '%'}} type="range" value="50" readOnly/>
                    </div>
                  </li>
                  <li>
                    <h4>Microphone Volume</h4> 
                    <div className="flex-row flex-row--ends w3-margin-bottom">
                      <i className="fa-microphone fa fa-lg fa-fw w3-margin-right"/>
                      <input style={{width: 100 + '%'}} type="range" value="100" readOnly/>
                    </div>
                  </li>
                </ul>

              </main>
            </div>
            <span onClick={this.togglePanel.bind(this, 'presentationControl')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-tv fa fa-lg fa-fw w3-margin-right"/>Presentation
            </span>
            <div className={presentationControl}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'presentationControl')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Presentation
                </a>
              </header>
              <main className="panel__content w3-container">
                <ul className="w3-ul w3-text-teal">
                  <li>
                    <h4>Playback</h4>
                    <a className="flex-row">
                      <label>
                        <input type="file" style={{display: "none"}}/>
                        <i className="fa-folder-open-o fa fa-lg fa-fw w3-margin-right"/>Open Presentation
                      </label>
                    </a>
                    <div className="w3-section flex-row flex-row--center">
                      <button className='w3-btn w3-text-white w3-cyan w3-margin-right'>
                        <i className='fa-backward fa fa-lg'/>
                      </button>
                      <button className={playback.playPauseButton} onClick={this.togglePlayback.bind(this)}>
                        <i className={playback.playPauseButtonIcon}/>
                      </button>
                      <button className='w3-btn w3-text-white w3-cyan'>
                        <i className='fa-forward fa fa-lg'/>
                      </button>
                    </div>
                    <div className="w3-margin-bottom">
                      <input style={{width: 100 + '%'}} type="range" value="50" readOnly/>
                      <p className="w3-center w3-text-cyan" style={{width: 100 + '%'}}>00:02:10/00:05:20</p>
                    </div>
                  </li>
                  <li>
                    <h4>Record</h4>
                    <a className="flex-row w3-text-teal" href="#!">
                      <i className="fa-save fa fa-lg w3-margin-right"/>
                      Save Presentation
                    </a>
                    <div className="w3-section flex-row flex-row--center" style={{width: 100 + '%'}}>
                      <button className={record.recordingButton} onClick={this.toggleRecord.bind(this)}>
                        <i className={record.recordingButtonIcon}/>
                      </button>
                      <button className={record.pauseResumeButton} onClick={this.toggleResume.bind(this)}>
                        <i className={record.pauseResumeButtonIcon}/>
                      </button>
                    </div>
                    <p className="w3-center w3-text-teal" style={{width: 100 + '%'}}>00:02:35</p>
                  </li>
                </ul>
              </main>
            </div>
            <span onClick={this.togglePanel.bind(this, 'importExport')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-files-o fa fa-lg fa-fw w3-margin-right"/>Slides
            </span>
            <div className={importExport}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'importExport')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Import/Export
                </a>
              </header>
              <main className="panel__content w3-container">
                <ul className="w3-ul">
                  <li>
                    <a className="flex-row w3-padding-0 w3-section w3-text-teal">
                      <label>
                        <input type="file" accept=".pdf,.jpg,.png," style={{display: "none"}}/>
                        <i className="fa-sign-in fa fa-lg fa-fw w3-margin-right"/>Import Slides
                      </label>
                    </a>
                  </li>
                  <li>
                    <a className="flex-row w3-padding-0 w3-section w3-text-teal" href="#!">
                      <i className="fa-sign-out fa fa-lg fa-fw w3-margin-right"/>
                      Export Slides
                    </a>
                  </li>
                  <li>
                    <a className="flex-row w3-padding-0 w3-section w3-text-teal" href="#!">
                      <i className="fa-file-o fa fa-lg fa-fw w3-margin-right"/>
                      Insert Blank Slide
                    </a>
                  </li>
                </ul>
              </main>
            </div>
            <span onClick={this.togglePanel.bind(this, 'vote')} className='menu__item w3-margin-left w3-left-align w3-white w3-text-teal'>
              <i className="fa-tasks fa fa-lg fa-fw w3-margin-right"/>Voting
            </span>
            <div className={vote}>
              <header className="panel__header w3-container w3-teal">
                <a className="w3-teal w3-left-align" onClick={this.togglePanel.bind(this, 'vote')}>
                  <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
                  Voting
                </a>
              </header>
              <main className="panel__content w3-container">
                <ul className="w3-ul w3-text-teal">
                  <li>
                    <h4>Polls</h4>
                    <div className="w3-dropdown-click w3-slim w3-margin-bottom">
                      <button onClick={this.togglePollList.bind(this)} className="w3-btn w3-btn-block w3-teal">
                        {this.state.voting.poll || 'Choose a poll'}
                        <i className="fa-caret-down fa fa-fw w3-margin-left"></i>
                      </button>
                      <div className={voting.polls}>
                        <a className="voting-polls__tag" onClick={this.changePoll.bind(this, 'Like WebMISTC?')} href="#">Like WebMISTC?</a>
                        <a className="voting-polls__tag" onClick={this.changePoll.bind(this, 'Like waffles?')} href="#">Like waffles?</a>
                      </div>
                    </div>
                    {this.state.voting.poll === 'Like WebMISTC?' ? 
                      <div className="w3-slim">
                        <div className="w3-progress-container w3-grey">
                          <div className="w3-progressbar w3-orange" style={{width: 75 + '%'}}/>
                          <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>Yes | 15 votes | 75%</div>
                        </div>
                        <div className="w3-progress-container w3-grey">
                          <div className="w3-progressbar w3-blue" style={{width: 25 + '%'}}/>
                          <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>Yeah! | 5 votes | 25%</div>
                        </div>
                      </div>
                    :''}
                    {this.state.voting.poll === 'Like waffles?' ? 
                      <div>
                        <div className="w3-progress-container w3-grey">
                          <div className="w3-progressbar w3-green" style={{width: 100 + '%'}}/>
                          <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>Yes | 20 votes | 100%</div>
                        </div>
                        <div className="w3-progress-container w3-grey">
                          <div className="w3-progressbar w3-red" style={{width: 0 + '%'}}/>
                          <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>No | 0 votes | 0%</div>
                        </div>
                      </div>
                    :''}
                    {this.state.voting.poll ? 
                      <button onClick={this.togglePoll.bind(this)} className="w3-btn-block w3-section w3-cyan w3-text-white w3-ripple w3-padding">
                        <i className={voting.startedButtonIcon}/>
                        {this.state.voting.started ? 'Cutoff Votes' : 'Accept Votes'}
                      </button>
                    :''}
                  </li>
                  <li>
                    <h4>Create</h4>
                    <form onSubmit={(event)=>{event.preventDefault()}}>                   
                      <div className="flex-row w3-row w3-section">
                        <div className="w3-col" style={{width: 35 + 'px'}}>
                          <i className="fa-tag fa fa-lg fa-fw"/>
                        </div>
                        <div className="w3-rest">
                          <input className="w3-input" name="title" type="text" placeholder="tag"/>
                        </div>
                      </div>

                      <div className="flex-row w3-row w3-section">
                        <div className="w3-col" style={{width: 35 + 'px'}}>
                          <i className="fa-pencil-square-o fa fa-lg fa-fw"/>
                        </div>
                        <div className="w3-rest">
                          <input className="w3-input" name="answer1" type="text" placeholder="yes"/>
                        </div>
                      </div>

                      <div className="flex-row w3-row w3-section">
                        <div className="w3-col" style={{width: 35 + 'px'}}>
                          <i className="fa-pencil-square-o fa fa-lg fa-fw"/>
                        </div>
                        <div className="w3-rest">
                          <input className="w3-input" name="answer2" type="text" placeholder="no"/>
                        </div>
                      </div>

                      <div className="flex-row w3-row w3-section">
                        <a>
                          <i className="fa-plus fa fa-lg fa-fw w3-margin-right"/>
                          Add Answer
                        </a>
                      </div>

                      <button className="w3-btn-block w3-section w3-cyan w3-text-white w3-ripple w3-padding">
                        <i className='fa-share-square-o fa fa-lg fa-fw w3-margin-right'/>
                        Start New Poll
                      </button>

                    </form>
                  </li>
                </ul>
              </main>
            </div>
          </div>
        </nav>

        {/* Slide Navigation*/}
        <div className="slide-nav-progress clickable w3-progress-container w3-grey w3-opacity" onClick={this.toggleSlideNav.bind(this)}>
          <div className="w3-progressbar w3-blue-grey" style={{width: 42 + '%'}}>
          </div>
          <div className="w3-center w3-text-white">10/23</div>
        </div>
        <span className="slide-nav-prev clickable w3-text-teal w3-opacity-max" onClick={this.moveSlide.bind(this, 'left')}>
          <i className="fa-chevron-left fa fa-4x"/>
        </span>
        <span className="slide-nav-next clickable w3-text-teal w3-opacity-max" onClick={this.moveSlide.bind(this, 'right')}>
          <i className="fa-chevron-right fa fa-4x"/>
        </span>
        <nav className={slideNav}>
          <section className="slide-nav w3-border-left w3-border-right ">
            <Draggable axis="x" bounds={{top: 0, left: -1250, right: 0, bottom: 0}}>
              <div>
                <span className="slide-nav__slides flex-row">
                  <a className={slideThumbnail.slide1} onClick={this.changeSlide.bind(this, 'slide1')}><h3>slide 1</h3></a>
                  <a className={slideThumbnail.slide2} onClick={this.changeSlide.bind(this, 'slide2')}><h3>slide 2</h3></a>
                  <a className={slideThumbnail.slide3} onClick={this.changeSlide.bind(this, 'slide3')}><h3>slide 3</h3></a>
                  <a className={slideThumbnail.slide4} onClick={this.changeSlide.bind(this, 'slide4')}><h3>slide 4</h3></a>
                  <a className={slideThumbnail.slide5} onClick={this.changeSlide.bind(this, 'slide5')}><h3>slide 5</h3></a>
                  <a className={slideThumbnail.slide6} onClick={this.changeSlide.bind(this, 'slide6')}><h3>slide 6</h3></a>
                </span>
              </div>
            </Draggable>
          </section>
        </nav>

        {/*<!-- Overlay -->*/}
        <div className={overlay} onClick={this.closeMenus.bind(this)} style={{cursor:"pointer"}}></div>

        {/*<!-- Page content -->*/}
        <Whiteboard />

        {/* Toast Example */}
        <div className={chip} style={{top: '30px'}}>
          <span className="chip__icon w3-deep-orange">
            <i className="fa-bullhorn fa fa-fw"/>
          </span>
          Student 1
        </div>
        <div className={chip} style={{top: '60px'}}>
          <span className="chip__icon w3-deep-orange">
            <i className="fa-users fa fa-fw"/>
          </span>
          {"Professor \u279C Admin ?"}
        </div>

      </div>
    );
  }
}
