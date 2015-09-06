Inspired by @kentcdodds's amazing [First Timers Only](https://medium.com/@kentcdodds/first-timers-only-78281ea47455), I'd like to assist a new contributor to do the fix for this issue. Here are the steps it would take out of my head, but please don't hesitate to ping me at any time here in the comments, at http://hood.ie/chat/ or at https://twitter.com/gr2m/.

# Your First PR

## Steps

1. Clone this repository

   - You will need a GitHub account: https://github.com/join
   - Open https://github.com/hoodiehq/pouchdb-hoodie-api and hit the "fork" button on the top right
   - Clone your fork to your local machine

   Find more information on Forking at https://guides.github.com/activities/forking/

2. Install dependencies

   - You will need [Node.js](https://nodejs.org/) installed on your machine
   - You will need a recent `npm` version, run `npm install -g npm@^2.1.0`
   - Run `npm install` in the `pouchdb-hoodie-api` folder. This could take a moment

3. Run the tests

   - Run `npm test` in the `pouchdb-hoodie-api` folder. The output should look [like this](https://gist.github.com/d1171e6f5ff0693c55ea). The most important bit is

   ```
     total:     255
     passing:   255
   ```

4. Enable the first failing test

   - open [tests/specs/remove.js], look  for ["test.skip" in line 117](https://github.com/hoodiehq/pouchdb-hoodie-api/blob/master/tests/specs/remove.js#L117)
   - replace "test.skip" with just "test"
   - run "npm test" again
   - You should now see two failing assertions

   ```
     total:     259
     passing:   257
     failing:   2
   ```

5. Fix the failing test (aka the interesting bit :)

   - `api.remove` can be called with an "id", and object with a "id" property, or an array of IDs, objects, or a combination of both:

   ```js
   api.remove(id)
   api.remove(object)
   api.remove([object1, id2])
   ```

   - api.remove is implemented in [remove.js](remove.js). In [lines 17-18](https://github.com/hoodiehq/pouchdb-hoodie-api/blob/master/remove.js#L17-L18) you see two things:
     1. It differentiates between being called with just an id or an object, or an array
     2. It uses update methods to delete. This is a CouchDB speciality. You can delete an object by adding a `_delete` property as you can see it in the code. That way, all the other properties remain intact, the object doesn't dissapear entirely, it's just "marked" as deleted.
   - In the test we enabled above, we test that a call of `store.remove` with an array of objects with changed properties (`foo: 'changed'`) will return an array of objects with the `foo` property set to changed, so that is what we need to implement now. The `updateMany` method already supports all we need, what we need to change is to call it with an array of objects that have the `_deleted: true` property set, instead of passing `{_deleted: true}` as an extra argument.
   - There are many ways to solve this, I'll leave it up to you :) But I'm here for questions

Note this is the first time I try to make an issue "first time contributer"-friendly. I likely missed a lot in the steps above that I take for granted, but really isn't. So please keep in mind: We can learn as much from you as you can learn from us :)

Good luck!

This was stolen from this Hoodie issue: https://github.com/hoodiehq/pouchdb-hoodie-api/issues/48#issuecomment-133729877
