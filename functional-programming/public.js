/* ************************* new block-comment fn  ************************* */
function newBlock(description, fn) {

  console.log(`\n<<<<<<-------- ${description} begin --------------\n`);

    try {
      if (typeof fn == 'function') {
        fn();
      }
    } catch (e) {
      console.log(`\n error: ${e}\n` );
    }

  console.log(`\n-------------- ${description} end --------->>>>>>>\n`);
}

export newBlock;
