/**
 * Laundry Problem
 * Question 2
 *
 * @returns {any} Trip data analysis
 */

 const getMaxPairs = (noOfWashes, cleanPile, dirtyPile) => {

  let sockPair = 0;
  let cleanBucket = [];
  cleanPile.sort((a, b) => a - b);

  for (let sock of cleanPile) {
    
      if (cleanBucket.length == 0) {
        cleanBucket.push(sock);
      } else if (cleanBucket.length > 0) {
          if (cleanBucket[cleanBucket.length - 1] == sock) {
            cleanBucket.pop();
            sockPair++;
          } else {
            cleanBucket.push(sock);
          }
      }
  }

  for (let sock of cleanBucket) {

      if (noOfWashes > 0) {
          if (dirtyPile.includes(sock)) {
              noOfWashes--;
              sockPair++;
              let index = dirtyPile.findIndex((item) => item == sock);
              dirtyPile.splice(index, 1);
          }
      }
  }

  dirtyPile.sort((a, b) => a - b);
  let dirtyBucket = [];

  for (let sock of dirtyPile) {

      if (noOfWashes >= 2) {
          if (dirtyBucket.length == 0) {
              dirtyBucket.push(sock);
          } else if (noOfWashes > 0) {
              if (dirtyBucket[dirtyBucket.length - 1] == sock) {
                  dirtyBucket.pop();
                  sockPair++;
                  noOfWashes -= 2;
              } else {
                  dirtyBucket.push(sock);
              }
          }
      }
  }

  return sockPair;
}

module.exports = getMaxPairs;
