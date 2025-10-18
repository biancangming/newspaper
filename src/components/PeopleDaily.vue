<template>
  <div class="p-4 space-y-3 dark:text-gray-200">
    <div class="flex items-center gap-2">
      <label class="text-sm">选择版面代码：</label>
      <n-select v-model:value="selectedCode" :options="selectOptions" class="!w-64" />
      <n-button class="ml-2" type="primary" @click="refresh">刷新</n-button>
    </div>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="text-red-600 dark:text-red-400">{{ error }}</div>

    <div v-else class="h-[80vh] bg-neutral-50 dark:bg-neutral-800 rounded border border-gray-200 dark:border-gray-700">
      <object v-if="pdfUrl" :data="pdfUrl" type="application/pdf" width="100%" height="100%">
        <p>您的浏览器不支持直接预览 PDF。您可以点击下载：
          <a :href="pdfUrl" target="_blank" rel="noopener" class="text-gray-500 dark:text-gray-300">打开 PDF</a>
        </p>
      </object>
      <p v-else class="text-gray-600 dark:text-gray-400">当前版面暂无 PDF 或解析失败</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { peopleDailyPages } from "../utils/newspaper";

type PDItem = { code: string; title: string; href: string; url: string; pdf?: string }

const selectedCode = ref<string>('01')
const loading = ref(false)
const error = ref('')
const pdfUrl = ref<string>('')
const pages = ref<PDItem[]>([])
const selectOptions = computed(() => pages.value.map(p => ({ label: `第${p.code}版：${p.title}`, value: p.code })))

async function refresh() {
  loading.value = true
  error.value = ''
  pdfUrl.value = ''
  try {
    const list: PDItem[] = await peopleDailyPages(selectedCode.value)
    pages.value = list
    const cur = list.find((i: PDItem) => i.code === selectedCode.value)
    pdfUrl.value = cur?.pdf || ''
    if (!pdfUrl.value) {
      error.value = '未找到该版面的 PDF 链接'
    }
  } catch (e: any) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refresh()
})

watch(selectedCode, () => {
  refresh()
})
</script>