<template>
  <div class="common-layout">
    <el-container>
      <el-card style="width: 100%; height: 95%">
        <template #header>
          <div style="text-align: center; font-weight: bold">学习通AI助手</div>
        </template>
        <div style="display: flex; align-content: flex-start">
          <div style="flex: 3">
            <div>
              学习通账号：
              <el-input v-model="username" style="width: 50%; margin-left: 10%" placeholder="请输入账号" />
            </div>
            <div style="margin-top: 10px">
              学习通密码：
              <el-input type="password" v-model="password" style="width: 50%; margin-left: 10%" placeholder="请输入密码" show-password />
            </div>
            <div style="margin-top: 10px">
              第一题链接：
              <el-input v-model="cxurl" style="width: 50%; margin-left: 10%" placeholder="进入考试后的第一题链接" />
            </div>
            <div style="margin-top: 10px">
              模型服务：
              <el-select v-model="provider" aria-label="模型服务" style="width: 50%; margin-left: 10%">
                <el-option label="通义千问" value="tongyi" />
                <el-option label="Ollama" value="ollama" />
                <el-option label="OpenAI 兼容服务" value="openai" />
              </el-select>
            </div>
            <div style="margin-top: 10px">
              文本模型：
              <el-input v-model="modelNames[provider]" aria-label="文本模型" style="width: 50%; margin-left: 10%" :placeholder="modelPlaceholders[provider]" />
            </div>
            <div v-if="provider !== 'ollama'" style="margin-top: 10px">
              图片模型：
              <el-input v-model="visionModels[provider]" aria-label="图片模型" style="width: 50%; margin-left: 10%" :placeholder="provider === 'tongyi' ? '默认 qwen-vl-max-latest' : '留空使用文本模型'" />
            </div>
            <div v-if="provider !== 'tongyi'" style="margin-top: 10px">
              服务地址：
              <el-input v-model="serviceUrls[provider]" aria-label="服务地址" style="width: 50%; margin-left: 10%" :placeholder="provider === 'ollama' ? 'http://localhost:11434' : 'https://api.example.com/v1'" />
            </div>
            <div v-if="provider === 'openai'" style="margin-top: 10px">
              API Key：
              <el-input v-model="openaiApiKey" aria-label="API Key" type="password" show-password style="width: 50%; margin-left: 10%" placeholder="无需认证时可留空" />
            </div>
            <div v-if="provider === 'tongyi'" style="margin-top: 10px">
              通义Token：
              <el-input v-model="tyapi" type="password" show-password style="width: 50%; margin-left: 10%" placeholder="通义千问 API Token" />
              <a @click.prevent="startie('https://bailian.console.aliyun.com/?apiKey=1#/api-key')" style="margin-left: 10px" href="#">申请API</a>
            </div>
            <div style="margin-top: 10px">
              类型：
              <el-select v-model="taskType" style="width: 50%; margin-left: 10%" placeholder="请选择类型">
                <el-option label="考试" value="exam" />
                <el-option label="作业" value="homework" />
              </el-select>
            </div>
          </div>
          <div style="flex: 1; color: #666; font-size: 12px">
            <div style="font-weight: bold; margin-bottom: 10px">免责声明：</div>
            <div style="line-height: 1.5">
              <p>
                本程序仅供学习和测试使用，请在下载24小时内删除，切勿用于考试舞弊等行为，所有使用本程序导致的后果皆由使用者自行承担，本项目不得用于违法违规用途，使用本程序即代表您同意此免责声明
              </p>
            </div>
          </div>
        </div>
        <template #footer>
          <div style="text-align: center">
            <el-button type="primary" @click="runCmd">开始作答</el-button>
            <div style="text-align: left">日志输出：</div>
            <pre
                id="output"
                style="text-align: left; margin-top: 10px; background: #f5f5f5; padding: 10px; border-radius: 4px; max-height: calc(100vh - 430px); overflow-y: auto"
            ></pre>
            <div>
              <a href="#" @click.prevent="startie('https://github.com/myxuebi/chaoxingStudy-Helper')">Github:myxuebi/chaoxingStudy-Helper</a>
            </div>
          </div>
        </template>
      </el-card>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 表单数据
const username = ref('')
const password = ref('')
const cxurl = ref('')
const tyapi = ref('')
const provider = ref('tongyi')
const modelNames = ref({ tongyi: '', ollama: '', openai: '' })
const modelPlaceholders = { tongyi: '默认 qwen-max', ollama: '默认 qwen2:latest', openai: '请输入服务提供的模型名称' }
const visionModels = ref({ tongyi: '', openai: '' })
const serviceUrls = ref({ ollama: '', openai: '' })
const openaiApiKey = ref('')
const taskType = ref()

// 运行命令
const runCmd = () => {
  const args = [
    `--username=${username.value}`,
    `--password=${password.value}`,
    `--url=${cxurl.value}`,
    `--homework=${taskType.value === 'homework' ? 'y' : 'n'}`,
    `--provider=${provider.value}`,
    `--model=${modelNames.value[provider.value].trim()}`,
  ]
  if (provider.value === 'ollama') {
    args.push(`--ollama-url=${serviceUrls.value.ollama.trim()}`)
  } else {
    const apiKey = provider.value === 'tongyi' ? tyapi.value : openaiApiKey.value
    args.push(`--api=${apiKey.trim()}`, `--vision-model=${visionModels.value[provider.value].trim()}`)
    if (provider.value === 'openai') {
      args.push(`--api-url=${serviceUrls.value.openai.trim()}`)
    }
  }
  window.electronAPI.send('run-cmd', args)
}

// 监听命令输出
onMounted(() => {
  const output = document.getElementById('output')
  window.electronAPI.on('cmd-output', (event, data) => {
    output.textContent += data
    output.scrollTop = output.scrollHeight
  })
})

// 打开外部链接（使用 Electron API）
function startie(url) {
  window.electronAPI.send('start-ie', url)
}
</script>

<style>
a,
a:visited,
a:link,
a:hover {
  color: blue;
}
</style>
