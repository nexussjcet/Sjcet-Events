<template>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search events by name" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['value'],
    computed: {
      searchQuery: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  </style>
  