#!/usr/bin/env node

/**
 * Semgrep 安全扫描脚本
 * 自动安装 Semgrep（如果未安装）并运行扫描
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SEMGREP_CONFIG = path.join(__dirname, '..', 'semgrep.yml');

function checkSemgrepInstalled() {
  try {
    execSync('semgrep --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function installSemgrep() {
  console.log('📦 Semgrep 未安装，正在安装...');
  try {
    // 尝试使用 pip 安装
    execSync('python3 -m pip install --user "semgrep<2"', { stdio: 'inherit' });
    console.log('✅ Semgrep 安装成功');
    return true;
  } catch (error) {
    console.error('❌ Semgrep 安装失败');
    console.error('请手动安装：python3 -m pip install --user semgrep');
    return false;
  }
}

function runSemgrep() {
  console.log('🔍 运行 Semgrep 安全扫描...\n');

  if (!fs.existsSync(SEMGREP_CONFIG)) {
    console.error(`❌ 配置文件不存在: ${SEMGREP_CONFIG}`);
    process.exit(1);
  }

  try {
    execSync(
      `semgrep --config ${SEMGREP_CONFIG} --metrics=off --exclude="node_modules" --exclude=".next" --exclude="dist" --exclude="build" --exclude="coverage" app/ components/ lib/ services/ repositories/`,
      { stdio: 'inherit' }
    );
    console.log('\n✅ Semgrep 扫描完成，未发现安全问题');
  } catch (error) {
    console.error('\n❌ Semgrep 扫描发现安全问题，请查看上方输出');
    process.exit(1);
  }
}

function main() {
  if (!checkSemgrepInstalled()) {
    if (!installSemgrep()) {
      process.exit(1);
    }
  }

  runSemgrep();
}

main();
