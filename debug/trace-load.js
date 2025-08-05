     console.log('=== TRACE LOAD START ===');
     console.log('Initial process.argv:', process.argv);

     // Check if jackspeak is being invoked during import
     const Module = require('module');
     const originalRequire = Module.prototype.require;

     Module.prototype.require = function(id) {
       if (id.includes('jack')) {
         console.log('Loading jackspeak module:', id);
         console.trace();
       }
       return originalRequire.apply(this, arguments);
     };

     console.log('About to import cli.test.js...');
     await import('./cli.test.js');

     console.log('=== TRACE LOAD END ===');