// 1. Caching updates for other query keys are being moved to hooks 
//    when they must always happen together anyway (ex: creating hello means updates to upcoming, user stats, and settings)

// 2. Mutation-based flash messages are being moved into hooks by default, moved into local components when ui components need to directly respond
//    and there is no overhead architecture doing the work
