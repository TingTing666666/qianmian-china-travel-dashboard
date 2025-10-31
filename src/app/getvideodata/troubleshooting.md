# YouTube 数据爬取故障排除指南

## 问题诊断

根据您遇到的 "fetch failed" 错误，我们已经进行了网络诊断，发现了以下问题：

### 网络连接问题
- **症状**: `fetch failed` 错误
- **原因**: 无法访问 YouTube API (www.googleapis.com)
- **诊断结果**: 当前网络无法访问 Google/YouTube（HTTPS 443 端口超时），与 API Key 无关；包括你提供的 Key 在此网络下也会失败。
  - DNS 解析正常 ✅
  - 网络连接失败 ❌ (TCP 连接到 443 端口失败)

## 可能的解决方案

### 1. 网络环境检查
- **防火墙设置**: 检查是否有防火墙阻止了对 googleapis.com 的访问
- **企业网络**: 如果在企业网络环境中，可能需要配置代理
- **VPN**: 尝试使用 VPN 或更换网络环境

### 2. 代理配置 (如果需要)
如果您的网络需要代理，可以尝试以下方法：

#### 方法 A: 设置系统代理
```bash
# 在 PowerShell 中设置代理环境变量
$env:HTTP_PROXY = "http://your-proxy:port"
$env:HTTPS_PROXY = "http://your-proxy:port"
```

#### 方法 B: 使用代理工具
- 使用 Clash、V2Ray 等代理工具
- 确保代理工具允许 googleapis.com 域名通过

### 3. 网络测试命令
```bash
# 测试 Google APIs 连接
Test-NetConnection -ComputerName www.googleapis.com -Port 443

# 测试 DNS 解析
nslookup www.googleapis.com

# 使用 curl 测试 API
curl -v "https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&key=YOUR_API_KEY"
```

### 4. 替代方案
如果网络问题无法解决，可以考虑：
- 使用其他网络环境进行测试
- 联系网络管理员配置防火墙规则
- 使用移动热点等其他网络连接

## 已实施的改进

我们已经对代码进行了以下改进：
1. ✅ 增加了详细的错误日志
2. ✅ 添加了 30 秒超时设置
3. ✅ 增加了重试延迟 (2秒)
4. ✅ 改进了错误信息提示
5. ✅ 添加了 User-Agent 头部

## 下一步操作

1. **检查网络连接**: 确认能否访问 https://www.googleapis.com
2. **测试 API**: 访问 http://localhost:3001/api/test-youtube 查看详细测试结果
3. **配置代理**: 如果在受限网络环境中，配置适当的代理设置
4. **联系管理员**: 如果是企业网络，联系 IT 管理员开放相关域名访问权限

## 联系支持

如果问题仍然存在，请提供以下信息：
- 网络环境描述 (家庭/企业/学校等)
- 是否使用代理或 VPN
- 防火墙软件信息
- 测试命令的完整输出结果