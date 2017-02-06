import merge from '../../util/merge'

const initialState = {
  selectedPerson: {}
}

export const selectPerson = (person) => ({
  type: 'person/SELECT_PERSON',
  person
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'person/SELECT_PERSON':
      state = merge(state, {
        selectedPerson: action.person
      })
      break
  }
  return state
}

export default reducer
