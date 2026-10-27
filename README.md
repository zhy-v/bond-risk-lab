# 债券利率风险实验台

金融市场与金融机构期中基准原型 v0.1，制作日期为2026年10月27日。

## 公开项目路径

https://github.com/zhy-v/bond-risk-lab

四部分说明见 [项目说明](项目说明.md)，PDF见 [期中项目说明](期中项目说明.pdf)。下载整个仓库后双击根目录 index.html 即可运行。

## 运行与教师核验

最简单的方法是下载本仓库根目录的 index.html 后双击打开；或使用提交包中的“债券风险实验台.html”。该单文件离线演示与dist中的代码一致，不需要安装软件或配置API。

开发版本：用现代浏览器打开 `dist/index.html`。所有计算均在本机进行。

命令行数值验证需要Node.js 18或更高版本：

```sh
node tests/engine.test.js
node skills/bond-risk-explainer/scripts/analyze.js skills/bond-risk-explainer/examples/long-bond.json
```

当前结果：17组自动检查通过，其中一个检查包含90组期限与频率组合。结果保存在 `evidence/test-results.json`，运行会更新其中时间戳；原始期中记录保存在交付压缩包。

## 五分钟复现

1. 选择“10年期低息债”，保持面值1000元、票息2%、YTM2%、冲击+100bp、持有1年、不再投资。
2. 观察即时价格914.70元、即时跌幅8.53%，以及1年后价格922.14元、总回报-5.79%。
3. 切换“2年期对照”，对照1年总回报+1.03%。
4. 观察久期近似与精确定价的误差，并比较凸性修正。
5. 导出CSV，核对每期现金流现值及权重。

## 功能与口径

可调面值、票息率、名义年化YTM、剩余整年期限、年付息次数、平行收益率冲击、持有整年期及票息再投资。支持现金流、价格、麦考利久期、修正久期、凸性、DV01和持有期有效年化回报；支持本机保存恢复与CSV导出。

买入和出售均在付息日，出售发生于付息后。收益率在买入后立即受到冲击，之后维持不变。每期利率为y/m。票息再投资选择开启时使用冲击后的y/m。半年和季度付息的名义YTM应转换为(1+y/m)^m−1后再与有效年化回报比较。

不支持信用违约、嵌入期权、真实日期、应计利息、税费、非平行收益率曲线和债券基金。所有预设是教学情景，不是实时市场数据。

## 文件索引

- `项目说明.md`：四部分完整说明，可编辑。
- `dist/`：网页和共享计算引擎。
- `tests/`：可执行数值检查。
- `skills/bond-risk-explainer/`：可复用金融Skill及命令行实例，未安装到个人技能库。
- `data/`：情景输入、字段及来源说明。
- `evidence/`：测试输出、示例输出、浏览器检查记录与AI使用记录。
- `CHANGELOG.md`、`decisions.md`：本次真实制作记录及模型选择。
- `周报模板.md`：未来十周使用，当前没有虚构周报内容。

## 行业对标

PIMCO公开久期教育材料：https://www.pimco.com/us/en/resources/education/bonds-102-the-importance-of-duration-in-bond-investing

QuantLib官网：https://www.quantlib.org/

CFA Institute利率风险与回报：https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/interest-rate-risk-and-return

核查日期：2026年10月27日。当前尚未安装或运行QuantLib，不声称完成专业库交叉验证。

## 真实性和隐私

AI辅助生成原型、测试和文字。学生需实际运行、复核核心决定并解释结果；本包不声称已经发生访谈、十周迭代或学生独立编程。原始PPT、教师联系方式和任务书原文件不包含在本项目源码中。原型不连接投资账户，也不提交作业。


