// example: set value
// note: nested objects, e.g. buzz.ding
//
// state.insert({
//   buzz: {
//     ding: true
//   }
// });
// state.update( { buzz: { $exists: true } }, { $set: { 'buzz.ding': true } } );

// example: select field
// note: ignores nested objects, e.g. foo.bar.baz
// http://docs.meteor.com/api/collections.html#fieldspecifiers
//
// state.insert({
//   buzz: true,
//   ding: true,
//   foo: {
//     bar: {
//       baz: true
//     }
//   }
// });
// state.findOne( { }, { fields: { 'foo': 1, _id: 0 } } ); 

import { Mongo } from 'meteor/mongo'; 
export const AppState = {};
export const State = new Mongo.Collection(null);

const initialState = {
  /*WHITEBOARD*/
  whiteboard_fullscreen: false,
  /*MICROPHONE*/

  mic_muted: false,

  /*TOOL*/
  tool_type: 'draw',
  tool_color: 'red',
  tool_size: 'medium',

  /*NOTES*/
  notes_menu_open: false,

  /*FEATURES*/
  features_menu_open: false,
  features_menu_show_questions: false,
  features_menu_show_chat: false,
  features_menu_show_message: false,
  features_menu_show_roles: false,
  features_menu_show_sound: false,
  features_menu_show_presentation_control: false,
  features_menu_show_import_export: false,
  features_menu_show_vote: false,

  /* SLIDES*/
  slides_menu_opened: false,
}
State.insert(initialState);


AppState.getAll = (query) => {
  const fields = Object
    .keys(initialState)
    .filter( namespace => !!namespace.match( new RegExp(`^${query}_`)))
    .reduce( (fields, namespace) => Object.assign(fields, { [namespace]: 1 }), {})
  return State.findOne( { }, { fields } );
};

AppState.get = (query) => State.findOne( { }, { fields: { [query]: 1} } )[query];

AppState.set = (key, value) => {
  const query = (value !== undefined) ? { [key]: value } : key;
  console.log(query)
  State.update( { [key]: { $exists: true } }, { $set: query });
}