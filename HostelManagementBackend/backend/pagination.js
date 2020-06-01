
// FUNCTION FOR THE PAGINATION
module.exports=(data,page,limit) => {

  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < data.length) {
        results.next = {
          page: parseInt(page) + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
        results.results = data.slice(startIndex,endIndex);
        return results;
    }
  

