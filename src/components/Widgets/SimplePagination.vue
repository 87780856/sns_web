<template>
  <el-pagination ref='elPagination'
    :page-size='pageSize'
    :total='pageTotal'
    :current-page.sync='currentPage'
    :small='pagination.small'
    :background='pagination.background'
    :page-count='pagination.pageCount'
    :layout='pagination.layout'
    :page-sizes='pagination.pageSizes'
    :popper-class='pagination.popperClass'
    :prev-text='pagination.prevText'
    :next-text='pagination.nextText'
    :disabled='pagination.disabled'
    @size-change='changePageSize'
    @current-change='changeCurrentPage' />
</template>

<script>
/**
 * 简单的分页
 */
export default {
  name: 'SimplePagination',
  components: {
  },
  props: {
    /**
     * 分页信息，参见elementui的el-pagination属性
     * 不包含page-size，page-total，current-page属性及所有事件
     */
    pagination: {
      type: Object,
      default: () => {
        return {
          pageSizes: [10, 20, 30, 40, 50, 100],
          layout: 'total, sizes, prev, pager, next, jumper',
          pageSize: 10,
        }
      },
    },

    /**
     * 页大小被改变
     * 参数：pageSize 当前被改变的页大小
     */
    changePageSize: {
      type: Function,
      //default: (pageSize) => { }
    },

    /**
     * 当前页被改变
     * 参数：currentPage 当前页数
     */
    changeCurrentPage: {
      type: Function,
      //default: (currentPage) => { }
    }
  },
  data: function () {
    return {
      pageTotal: 0,
      pageSize: this.pagination.pageSize,
      currentPage: this.pagination.currentPage,
    }
  },
  methods: {
    /**
     * 得到页总数
     */
    getPageTotal() {
      return this.pageTotal
    },
    /**
     * 设置页总数
     */
    setPageTotal(total) {
      this.pageTotal = total
    },
    /**
     * 得到每页大小
     */
    getPageSize() {
      return this.pageSize
    },
    /**
     * 设置每页大小
     */
    setPageSize(size) {
      this.pageSize = size
    },
    /**
     * 获取当前页数
     */
    getCurrentPage() {
      return this.currentPage
    },
  },
  watch: {
  },
}
</script>

<style scoped>
</style>
