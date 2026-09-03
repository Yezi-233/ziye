import numpy as np
import math
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

plt.rcParams['font.sans-serif']=['SimHei']
plt.rcParams['axes.unicode_minus']=False
class CheckinOptimization:
    def __init__(self):
        # 设施成本参数 (元/台/小时)
        self.cost_params = {
            'manual': {'fixed': 88.7, 'variable': 94.3, 'total': 183.0},
            'self_service': {'fixed': 60.4, 'variable': 40.0, 'total': 100.4}
        }

        # 旅客类型比例
        self.baggage_ratio = 0.748  # 托运旅客比例
        self.no_baggage_ratio = 0.232  # 无托运旅客比例

        # 服务时间参数
        # 人工值机服务时间数据 (秒)
        manual_times = [850, 845, 862, 853, 849, 848, 863, 854, 852, 851,
                        850, 859, 851, 849, 856, 852, 855, 851, 855, 855,
                        845, 857, 846, 865, 852]
        self.manual_service_rate = 3600 / (sum(manual_times) / len(manual_times))

        # 自助值机服务时间数据 (秒)
        self_service_times = [70, 78, 73, 74, 70, 73, 77, 73, 70, 75,
                              74, 69, 72, 72, 72, 72, 78, 68, 73, 71,
                              70, 72, 72, 77, 72]
        self.self_service_rate = 3600 / (sum(self_service_times) / len(self_service_times))

        # 时段定义 (24小时)
        self.time_slots = [
            "00:00-02:00", "02:00-04:00", "04:00-06:00", "06:00-08:00",
            "08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00",
            "16:00-18:00", "18:00-20:00", "20:00-22:00", "22:00-24:00"
        ]

        # 各时段旅客到达人数 (调整后)
        self.passenger_arrivals = [15, 10, 50, 110, 100, 150, 100, 90, 60, 80, 50, 10]

        # 最大柜台数量
        self.max_counters = {
            'manual': 10,
            'self_service': 7
        }

        # 打印服务率信息
        print(
            f"人工值机平均服务时间: {sum(manual_times) / len(manual_times) / 60:.2f}分钟, 服务率: {self.manual_service_rate:.2f}人/小时")
        print(
            f"自助值机平均服务时间: {sum(self_service_times) / len(self_service_times):.2f}秒, 服务率: {self.self_service_rate:.2f}人/小时")
        print(f"托运旅客比例: {self.baggage_ratio * 100:.1f}%, 无托运旅客比例: {self.no_baggage_ratio * 100:.1f}%")

    def mmc_waiting_time(self, arrival_rate, service_rate, num_counters):
        """计算M/M/c排队系统的平均等待时间"""
        if arrival_rate <= 0 or num_counters <= 0:
            return 0

        # 计算业务强度
        rho = arrival_rate / (num_counters * service_rate)

        # 系统不稳定时返回合理最大值
        if rho >= 1:
            return 60  # 最大等待60分钟

        # 计算系统空闲概率
        sum_term = 0
        for k in range(num_counters):
            sum_term += (num_counters * rho) ** k / math.factorial(k)

        p0 = 1 / (sum_term + (num_counters * rho) ** num_counters /
                  (math.factorial(num_counters) * (1 - rho)))

        # 计算排队等待时间 (小时)
        lq = (p0 * (num_counters * rho) ** num_counters * rho) / \
             (math.factorial(num_counters) * (1 - rho) ** 2)
        wq = lq / arrival_rate

        return wq * 60  # 转换为分钟

    def cost_function(self, counter_type, num_counters):
        """计算柜台运营成本"""
        cost_per_counter = self.cost_params[counter_type]['total']
        return cost_per_counter * num_counters

    def run_optimization(self):
        """执行优化过程并生成结果"""
        # 选择高峰时段 (06:00-08:00)
        time_index = 3
        total_passengers = self.passenger_arrivals[time_index]

        # 分离旅客类型
        manual_passengers = total_passengers * self.baggage_ratio
        self_service_passengers = total_passengers * self.no_baggage_ratio

        # 计算到达率 (人/小时)
        arrival_rate_manual = manual_passengers / 2  # 2小时时段
        arrival_rate_self = self_service_passengers / 2

        # 生成人工柜台候选方案
        manual_results = []
        for num_counters in range(1, self.max_counters['manual'] + 1):
            cost = self.cost_function('manual', num_counters)
            wait = self.mmc_waiting_time(arrival_rate_manual, self.manual_service_rate, num_counters)
            manual_results.append((num_counters, cost, wait))

        # 生成自助柜台候选方案
        self_service_results = []
        for num_counters in range(1, self.max_counters['self_service'] + 1):
            cost = self.cost_function('self_service', num_counters)
            wait = self.mmc_waiting_time(arrival_rate_self, self.self_service_rate, num_counters)
            self_service_results.append((num_counters, cost, wait))

        # TOPSIS排序
        manual_ranking = self.topsis(manual_results)
        self_service_ranking = self.topsis(self_service_results)

        # 获取最优配置
        manual_opt = manual_ranking[0][0] if manual_ranking else 1
        self_service_opt = self_service_ranking[0][0] if self_service_ranking else 1

        # 生成全时段配置结果
        config_results = []
        for i, passengers in enumerate(self.passenger_arrivals):
            # 分离旅客类型
            manual_passengers = passengers * self.baggage_ratio
            self_service_passengers = passengers * self.no_baggage_ratio

            # 计算到达率 (人/小时)
            arrival_rate_manual = manual_passengers / 2
            arrival_rate_self = self_service_passengers / 2

            # 人工柜台配置
            if i == time_index:
                # 高峰时段使用TOPSIS最优解
                manual_counters = manual_opt
            else:
                # 非高峰时段按需配置
                manual_counters = min(self.max_counters['manual'],
                                      max(1, round(arrival_rate_manual / 15)))

            # 自助柜台配置
            if i == time_index:
                # 高峰时段使用TOPSIS最优解
                self_service_counters = self_service_opt
            else:
                # 非高峰时段按需配置
                self_service_counters = min(self.max_counters['self_service'],
                                            max(1, round(arrival_rate_self / 30)))

            # 实际方案设为优化方案的80%
            manual_actual = max(1, round(manual_counters * 0.8))
            self_service_actual = max(1, round(self_service_counters * 0.8))

            config_results.append((
                i + 1, manual_actual, manual_counters,
                self_service_actual, self_service_counters
            ))

        return {
            'manual_results': manual_results,
            'self_service_results': self_service_results,
            'manual_ranking': manual_ranking,
            'self_service_ranking': self_service_ranking,
            'config_results': config_results,
            'time_index': time_index
        }

    def topsis(self, solutions):
        """TOPSIS方法进行方案排序"""
        if not solutions:
            return []

        # 提取成本和等待时间
        costs = np.array([s[1] for s in solutions])
        waits = np.array([s[2] for s in solutions])

        # 标准化决策矩阵
        norm_costs = costs / np.sqrt(np.sum(costs ** 2))
        norm_waits = waits / np.sqrt(np.sum(waits ** 2))

        # 权重 (成本:0.6, 等待时间:0.4)
        weighted_costs = norm_costs * 0.6
        weighted_waits = norm_waits * 0.4

        # 确定正负理想解
        positive_ideal = (np.min(weighted_costs), np.min(weighted_waits))
        negative_ideal = (np.max(weighted_costs), np.max(weighted_waits))

        # 计算距离
        d_positive = np.sqrt(
            (weighted_costs - positive_ideal[0]) ** 2 +
            (weighted_waits - positive_ideal[1]) ** 2
        )

        d_negative = np.sqrt(
            (weighted_costs - negative_ideal[0]) ** 2 +
            (weighted_waits - negative_ideal[1]) ** 2
        )

        # 计算贴近度
        closeness = d_negative / (d_positive + d_negative)

        # 排序结果
        ranked_indices = np.argsort(closeness)[::-1]
        ranked_solutions = []
        for idx in ranked_indices:
            ranked_solutions.append((
                solutions[idx][0],
                closeness[idx],
                solutions[idx][1],  # 成本
                solutions[idx][2]  # 等待时间
            ))

        return ranked_solutions

    def plot_pareto_front(self, results):
        """绘制帕累托前沿图"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

        # 人工柜台帕累托前沿
        manual_costs = [r[1] for r in results['manual_results']]
        manual_waits = [r[2] for r in results['manual_results']]
        ax1.scatter(manual_costs, manual_waits, c='blue', s=100, alpha=0.7)
        ax1.set_title('人工值机柜台帕累托前沿')
        ax1.set_xlabel('成本 (元)')
        ax1.set_ylabel('等待时间 (分钟)')
        ax1.grid(True, linestyle='--', alpha=0.7)

        # 标记最优解
        if results['manual_ranking']:
            best_manual = results['manual_ranking'][0]
            ax1.scatter(best_manual[2], best_manual[3], c='red', s=150, marker='*', label='最优解')
            ax1.legend()

        # 自助柜台帕累托前沿
        self_costs = [r[1] for r in results['self_service_results']]
        self_waits = [r[2] for r in results['self_service_results']]
        ax2.scatter(self_costs, self_waits, c='green', s=100, alpha=0.7)
        ax2.set_title('自助值机柜台帕累托前沿')
        ax2.set_xlabel('成本 (元)')
        ax2.set_ylabel('等待时间 (分钟)')
        ax2.grid(True, linestyle='--', alpha=0.7)

        # 标记最优解
        if results['self_service_ranking']:
            best_self = results['self_service_ranking'][0]
            ax2.scatter(best_self[2], best_self[3], c='red', s=150, marker='*', label='最优解')
            ax2.legend()

        plt.tight_layout()
        plt.savefig('pareto_front.png', dpi=300)
        plt.show()

    def print_results(self, results):
        """打印结果表格"""
        # 表5-5 某时段各值机设施配置方案
        time_slot = self.time_slots[results['time_index']]
        print(f"\n表5-5 {time_slot}时段各值机设施配置方案")
        print("{:<12} {:<15} {:<15} {:<15}".format(
            "值机设施", "开放数量(台)", "成本(元)", "排队时间(min)"))

        for res in results['manual_results']:
            print("{:<12} {:<15} {:<15.1f} {:<15.2f}".format(
                "人工值机", res[0], res[1], res[2]))

        for res in results['self_service_results']:
            print("{:<12} {:<15} {:<15.1f} {:<15.2f}".format(
                "自助值机", res[0], res[1], res[2]))

        # 表5-6 TOPSIS理想解排序结果
        print(f"\n表5-6 {time_slot}时段TOPSIS理想解排序结果")
        print("{:<12} {:<10} {:<15} {:<15} {:<15} {:<10}".format(
            "值机设施", "开放数量", "贴进度", "成本(元)", "排队时间(min)", "排序"))

        for i, rank in enumerate(results['manual_ranking']):
            print("{:<12} {:<10} {:<15.4f} {:<15.1f} {:<15.2f} {:<10}".format(
                "人工值机", rank[0], rank[1], rank[2], rank[3], i + 1))

        for i, rank in enumerate(results['self_service_ranking']):
            print("{:<12} {:<10} {:<15.4f} {:<15.1f} {:<15.2f} {:<10}".format(
                "自助值机", rank[0], rank[1], rank[2], rank[3], i + 1))

        # 表5-7 值机柜台配置结果
        print("\n表5-7 值机柜台配置结果")
        print("{:<5} {:<18} {:<18} {:<18} {:<18}".format(
            "时段", "人工值机实际方案", "人工值机优化方案",
            "自助值机实际方案", "自助值机优化方案"))

        for res in results['config_results']:
            print("{:<5} {:<18} {:<18} {:<18} {:<18}".format(
                res[0], res[1], res[2], res[3], res[4]))


# 执行优化
optimizer = CheckinOptimization()
results = optimizer.run_optimization()

# 打印结果
optimizer.print_results(results)

# 绘制帕累托前沿图
optimizer.plot_pareto_front(results)