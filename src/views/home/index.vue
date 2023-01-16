<template>
  <div class="guide-box">
    <n-list hoverable clickable class="list-box">
      <n-list-item @click="$router.push('/juntuan')">
        <n-thing title="4人本" content-style="margin-top: 10px;">
          <n-space size="small" style="margin-top: 4px">
            <n-tag :bordered="false" type="info" size="small">周本</n-tag>
            <n-tag :bordered="false" type="info" size="small">4人</n-tag>
          </n-space>
          军团<br />
          巴卡尼
        </n-thing>
      </n-list-item>
      <n-list-item @click="$router.push('/bakaer')">
        <n-thing title="12人本" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small"> 团本</n-tag>
              <n-tag :bordered="false" type="info" size="small"> 12人 </n-tag>
            </n-space>
          </template>
          巴卡尔<br />
          奥兹马<br />
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<script>
export default {
  name: "HomeGuide",
};
</script>

<style scoped>
.guide-box {
  display: flex;
  justify-content: center;
}
.list-box {
  width: 500px;
}
ul {
  background: -webkit-linear-gradient(
    rgba(150, 146, 146, 0.56),
    rgba(105, 102, 102, 0.22)
  );
}
</style>
