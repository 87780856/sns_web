function broadcast(componentId, eventName, params) {
  this.$children.forEach(child => {
    //var name = child.$options.componentId;
    var name = child.$el.id;
    
    if (name === componentId) {
      this.$emit.apply(this, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentId, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // dispatch(componentName, eventName, params) {
    //   var parent = this.$parent || this.$root;
    //   var name = parent.$options.componentName;

    //   while (parent && (!name || name !== componentName)) {
    //     parent = parent.$parent;

    //     if (parent) {
    //       name = parent.$options.componentName;
    //     }
    //   }
    //   if (parent) {
    //     parent.$emit.apply(parent, [eventName].concat(params));
    //   }
    // },
    broadcast(componentId, eventName, params) {
      broadcast.call(this, componentId, eventName, params);
    }
  }
};
