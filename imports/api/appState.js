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

export const collection = new Mongo.Collection(null);

const state = {
  whiteboard_fullscreen: false,

  mic_muted: false,

  tool_type: 'draw',
  tool_color: 'red',
  tool_size: 'medium',
}
collection.insert(state);

// TODO: regex on 'state' to build corresponding fields of 'collection'
// AppState.getAll = (query) => state.findOne( { }, { fields: { [query]: 1} } )[query];

AppState.get = (query) => collection.findOne( { }, { fields: { [query]: 1} } )[query];

// TODO: create guard in case query is not a boolean
AppState.toggle = (query) => {
  collection.update( { [query]: { $exists: true } }, { 
    $set: { 
      [query]: !AppState.get(query) 
    } 
  });
}

AppState.set = (key, value) => {
  // console.log(`key: ${key}, value: ${value}`)
  collection.update( { [key]: { $exists: true } }, { 
    $set: { 
      [key]: value
    } 
  });
}