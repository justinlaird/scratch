/*
MUST be required and io.init must be run before node_modules/hapi/index.js
is required, which is done the glue module below.
*/

/* $lab:coverage:off$ */
module.exports = function() {
  if (process.env.NODE_ENV === 'production') {
    const io = require('@pm2/io');
    io.init({
      metrics: {
        eventLoopActive: true, // (default: true) Monitor active handles and active requests
        eventLoopDelay: true,  // (default: true) Get event loop's average delay

        network : {       // Network monitoring at the application level
          traffic : true, // (default: true) Allow application level network monitoring
          ports   : true  // (default: false) Shows which ports your app is listening on
        },

        // Transaction Tracing system configuration
        transaction  : {
          http : true,              // (default: true) HTTP routes logging
          tracing: {                // (default: false) Enable transaction tracing
            http_latency: 1,        // (default: 200) minimum latency in milliseconds to take into account
            ignore_routes: [] // (default: empty) exclude some routes
          }
        },

        deepMetrics: {
          mongo: false,     // (default: true) Mongo connections monitoring
          mysql: true,     // (default: true) MySQL connections monitoring
          mqtt: false,      // (default: true) Mqtt connections monitoring
          socketio: false,  // (default: true) WebSocket monitoring
          redis: true,     // (default: true) Redis monitoring
          http: true,      // (default: true) Http incoming requests monitoring
          https: true,     // (default: true) Https incoming requests monitoring
          "http-outbound": true, // (default: true) Http outbound requests monitoring
          "https-outbound": true // (default: true) Https outbound requests monitoring
        },

        v8: {
          new_space: true,                    // (default: true) New objects space size
          old_space: true,                    // (default: true) Old objects space size
          map_space: true,                    // (default: true) Map space size
          code_space: true,                   // (default: true) Executable space size
          large_object_space: true,           // (default: true) Large objects space size
          total_physical_size: false,         // (default: false) Physical heap size
          total_heap_size: true,              // (default: true)  Heap size
          total_available_size: true,        // (default: false) Total available size for the heap
          total_heap_size_executable: true,   // (default: true)  Executable heap size
          used_heap_size: true,               // (default: true)  Used heap size
          heap_size_limit: true,              // (default: true)  Heap size maximum size
          malloced_memory: true,             // (default: false) Allocated memory
          peak_malloced_memory: true,        // (default: false) Peak of allocated memory
          does_zap_garbage: true,            // (default: false) Zap garbage enable/disable
          GC: {
            totalHeapSize: true,              // (default: true)  GC heap size
            totalHeapExecutableSize: true,    // (default: true)  GC executable heap size
            usedHeapSize: true,               // (default: true)  GC used heap size
            heapSizeLimit: true,             // (default: false) GC heap size maximum size
            totalPhysicalSize: true,         // (default: false) GC heap physical size
            totalAvailableSize: true,        // (default: false) GC available size
            mallocedMemory: true,            // (default: false) GC allocated memory
            peakMallocedMemory: true,        // (default: false) GC peak of allocated memory
            gcType: true,                     // (default: true)  Type of GC (scavenge, mark/sweep/compact, ...)
            gcPause: true                     // (default: true)  Duration of pause (in milliseconds)
          }
        }
      },

      actions: {
        eventLoopDump: true, // (default: false) Enable event loop dump action
        profilingCpu: true,   // (default: true) Enable CPU profiling actions
        profilingHeap: true   // (default: true) Enable Heap profiling actions
      },

    });
  }
};
/* $lab:coverage:on$ */
