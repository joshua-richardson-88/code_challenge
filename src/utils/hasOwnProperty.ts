const hasOwnProperty = <X extends Record<never, never>, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> => prop in obj

export default hasOwnProperty
