import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 示例：计数器 store（仅供参考，不会影响现有 UI）
export const useCounterStore = defineStore('counter', () => {
  const count = ref<number>(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }
  function decrement() {
    count.value--
  }
  function set(value: number) {
    count.value = value
  }

  return {
    count,
    double,
    increment,
    decrement,
    set,
  }
})