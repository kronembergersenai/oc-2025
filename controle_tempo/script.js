class TaskControlDashboard {
    constructor() {
        this.cronometro = {
            inicio: null,
            tempoDecorrido: 0,
            tempoPreset: 0,
            ativo: false,
            intervalId: null
        };

        this.dados = JSON.parse(localStorage.getItem('taskControlData')) || {
            tarefas: []
        };

        this.initializeComponents();
    }

    initializeComponents() {
        this.bindEvents();
        this.updatePresetDisplay();
        this.initializeChart();
        this.loadHistorico();
        this.updateDisplay();
    }

    bindEvents() {
        document.getElementById('btnIniciar').addEventListener('click', () => this.iniciarCronometro());
        document.getElementById('btnPausar').addEventListener('click', () => this.pausarCronometro());
        document.getElementById('btnGravar').addEventListener('click', () => this.gravarTarefa());
        document.getElementById('btnZerar').addEventListener('click', () => this.zerarCronometro());
        document.getElementById('btnReinicializar').addEventListener('click', () => this.reinicializarSistema());
        document.getElementById('btnExportPDF').addEventListener('click', () => this.exportarPDF());

        document.getElementById('presetHoras').addEventListener('change', () => this.updatePresetDisplay());
        document.getElementById('presetMinutos').addEventListener('change', () => this.updatePresetDisplay());

        window.addEventListener('beforeunload', (e) => {
            if (this.cronometro.ativo) {
                e.preventDefault();
                e.returnValue = 'Você tem um cronômetro ativo. Tem certeza que deseja sair?';
            }
        });
    }

    updatePresetDisplay() {
        const horas = parseInt(document.getElementById('presetHoras').value) || 0;
        const minutos = parseInt(document.getElementById('presetMinutos').value) || 0;

        this.cronometro.tempoPreset = (horas * 60 + minutos) * 60 * 1000;

        document.getElementById('timePreset').textContent = this.formatTime(this.cronometro.tempoPreset);
        this.updateEfficiency();
    }

    iniciarCronometro() {
        const tarefa = document.getElementById('tarefa').value;
        if (!tarefa) {
            this.showNotification('Por favor, selecione uma tarefa antes de iniciar!', 'error');
            return;
        }

        if (this.cronometro.tempoPreset === 0) {
            this.showNotification('Por favor, defina um tempo previsto!', 'error');
            return;
        }

        if (!this.cronometro.ativo) {
            this.cronometro.inicio = Date.now() - this.cronometro.tempoDecorrido;
            this.cronometro.ativo = true;
            this.cronometro.intervalId = setInterval(() => this.updateDisplay(), 100);

            this.updateButtons(true, false, false);
            this.showNotification('⏱️ Cronômetro iniciado!', 'success');
        }
    }

    pausarCronometro() {
        if (this.cronometro.ativo) {
            clearInterval(this.cronometro.intervalId);
            this.cronometro.ativo = false;
            this.cronometro.tempoDecorrido = Date.now() - this.cronometro.inicio;

            this.updateButtons(false, true, false);
            this.showNotification('⏸️ Cronômetro pausado!', 'warning');
        }
    }

    gravarTarefa() {
        if (this.cronometro.tempoDecorrido === 0) {
            this.showNotification('Não há tempo para gravar!', 'error');
            return;
        }

        const tarefa = document.getElementById('tarefa').value;
        const modalidade = document.getElementById('modalidade').value;
        const eficiencia = this.calculateEfficiency();

        const registro = {
            id: Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            hora: new Date().toLocaleTimeString('pt-BR'),
            tarefa: document.getElementById('tarefa').options[document.getElementById('tarefa').selectedIndex].text,
            tempoPrevistoMs: this.cronometro.tempoPreset,
            tempoRealMs: this.cronometro.tempoDecorrido,
            tempoPrevisto: this.formatTime(this.cronometro.tempoPreset),
            tempoReal: this.formatTime(this.cronometro.tempoDecorrido),
            eficiencia: eficiencia,
            modalidade: modalidade === '18' ? 'Instalações Prediais' : 'Controle Industrial',
            status: this.getEfficiencyStatus(eficiencia)
        };

        this.dados.tarefas.push(registro);
        this.saveData();
        this.updateChart();
        this.loadHistorico();
        this.zerarCronometro();

        this.showNotification('💾 Tarefa gravada com sucesso!', 'success');
    }

    zerarCronometro() {
        clearInterval(this.cronometro.intervalId);
        this.cronometro.tempoDecorrido = 0;
        this.cronometro.ativo = false;
        this.cronometro.intervalId = null;

        this.updateDisplay();
        this.updateButtons(false, true, true);
    }

    updateButtons(iniciar, pausar, gravar) {
        document.getElementById('btnIniciar').disabled = iniciar;
        document.getElementById('btnPausar').disabled = pausar;
        document.getElementById('btnGravar').disabled = gravar;
    }

    reinicializarSistema() {
        if (confirm('⚠️ Tem certeza que deseja reinicializar todos os dados?\n\nEsta ação não pode ser desfeita!')) {
            this.zerarCronometro();
            localStorage.removeItem('taskControlData');
            this.showNotification('🔄 Sistema reinicializado!', 'warning');
            setTimeout(() => location.reload(), 1500);
        }
    }

    updateDisplay() {
        if (this.cronometro.ativo) {
            this.cronometro.tempoDecorrido = Date.now() - this.cronometro.inicio;
        }

        const displayReal = document.getElementById('timeReal');
        displayReal.textContent = this.formatTime(this.cronometro.tempoDecorrido);

        // Verificar se passou do tempo previsto
        if (this.cronometro.tempoDecorrido > this.cronometro.tempoPreset && this.cronometro.tempoPreset > 0) {
            displayReal.classList.add('overtime');
        } else {
            displayReal.classList.remove('overtime');
        }

        // Adicionar efeito pulsante quando ativo
        if (this.cronometro.ativo) {
            displayReal.style.animation = 'pulse 2s infinite';
        } else {
            displayReal.style.animation = 'none';
        }

        this.updateEfficiency();
    }

    updateEfficiency() {
        const efficiency = this.calculateEfficiency();
        const status = this.getEfficiencyStatus(efficiency);

        document.getElementById('efficiencyPercentage').textContent = `${efficiency}%`;
        document.getElementById('efficiencyStatus').textContent = status;

        const effDisplay = document.getElementById('efficiencyDisplay');
        effDisplay.className = 'efficiency-display';

        if (efficiency >= 90) {
            effDisplay.style.background = 'linear-gradient(145deg, #d4edda, #e8f5e8)';
            effDisplay.style.borderLeftColor = '#28a745';
        } else if (efficiency >= 70) {
            effDisplay.style.background = 'linear-gradient(145deg, #d1ecf1, #e8f4f8)';
            effDisplay.style.borderLeftColor = '#17a2b8';
        } else if (efficiency >= 50) {
            effDisplay.style.background = 'linear-gradient(145deg, #fff3cd, #fef9e7)';
            effDisplay.style.borderLeftColor = '#ffc107';
        } else {
            effDisplay.style.background = 'linear-gradient(145deg, #f8d7da, #fce8ea)';
            effDisplay.style.borderLeftColor = '#dc3545';
        }
    }

    calculateEfficiency() {
        if (this.cronometro.tempoPreset === 0 || this.cronometro.tempoDecorrido === 0) {
            return 0;
        }

        const efficiency = (this.cronometro.tempoPreset / this.cronometro.tempoDecorrido) * 100;
        return Math.round(efficiency);
    }

    getEfficiencyStatus(efficiency) {
        if (efficiency >= 95) return 'Excelente! 🌟';
        if (efficiency >= 80) return 'Muito Bom! 👍';
        if (efficiency >= 70) return 'Bom 👌';
        if (efficiency >= 50) return 'Regular ⚠️';
        return 'Precisa Melhorar 📚';
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    initializeChart() {
        const ctx = document.getElementById('graficoEficiencia').getContext('2d');
        this.graficoEficiencia = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Eficiência (%)',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150,
                        title: {
                            display: true,
                            text: 'Eficiência (%)'
                        },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tarefas Executadas'
                        },
                        grid: { display: false }
                    }
                }
            }
        });

        this.updateChart();
    }

    updateChart() {
        const ultimasTarefas = this.dados.tarefas.slice(-10);
        const labels = ultimasTarefas.map((tarefa, index) => `T${index + 1}`);
        const eficiencias = ultimasTarefas.map(tarefa => tarefa.eficiencia);

        const cores = eficiencias.map(eff => {
            if (eff >= 90) return '#28a745';
            if (eff >= 70) return '#17a2b8';
            if (eff >= 50) return '#ffc107';
            return '#dc3545';
        });

        this.graficoEficiencia.data.labels = labels;
        this.graficoEficiencia.data.datasets[0].data = eficiencias;
        this.graficoEficiencia.data.datasets[0].backgroundColor = cores;
        this.graficoEficiencia.data.datasets[0].borderColor = cores;
        this.graficoEficiencia.update();
    }

    loadHistorico() {
        const tbody = document.getElementById('historicoTarefas');
        tbody.innerHTML = '';

        const ultimasTarefas = this.dados.tarefas.slice(-15).reverse();

        if (ultimasTarefas.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center; color: #666;">Nenhuma tarefa registrada ainda</td>';
            tbody.appendChild(row);
            return;
        }

        ultimasTarefas.forEach(tarefa => {
            let badgeClass = '';
            if (tarefa.eficiencia >= 90) badgeClass = 'eff-excellent';
            else if (tarefa.eficiencia >= 70) badgeClass = 'eff-good';
            else if (tarefa.eficiencia >= 50) badgeClass = 'eff-average';
            else badgeClass = 'eff-poor';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tarefa.data}<br><small>${tarefa.hora}</small></td>
                <td>${tarefa.tarefa}</td>
                <td><strong>${tarefa.tempoPrevisto}</strong></td>
                <td><strong>${tarefa.tempoReal}</strong></td>
                <td><strong>${tarefa.eficiencia}%</strong></td>
                <td><span class="efficiency-badge ${badgeClass}">${tarefa.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    async exportarPDF() {
        this.showNotification('📄 Gerando PDF...', 'warning');

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            // Título
            pdf.setFontSize(20);
            pdf.setTextColor(0, 51, 102);
            pdf.text('Relatório de Treinamento - Olimpíadas SENAI', 20, 30);

            // Subtítulo
            pdf.setFontSize(14);
            pdf.setTextColor(100, 100, 100);
            pdf.text('SENAI Petrópolis - Controle por Tarefa', 20, 40);

            // Data do relatório
            pdf.setFontSize(10);
            pdf.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 50);

            // Estatísticas gerais
            const totalTarefas = this.dados.tarefas.length;
            const eficienciaMedia = totalTarefas > 0 
                ? this.dados.tarefas.reduce((sum, tarefa) => sum + tarefa.eficiencia, 0) / totalTarefas 
                : 0;

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Resumo Executivo:', 20, 70);
            pdf.setFontSize(10);
            pdf.text(`Total de tarefas executadas: ${totalTarefas}`, 25, 80);
            pdf.text(`Eficiência média: ${Math.round(eficienciaMedia)}%`, 25, 90);

            // Tabela de histórico
            let yPosition = 110;
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Histórico de Tarefas:', 20, yPosition);

            yPosition += 15;

            // Cabeçalho da tabela
            pdf.setFontSize(8);
            pdf.setTextColor(255, 255, 255);
            pdf.setFillColor(0, 51, 102);
            pdf.rect(20, yPosition - 5, 170, 10, 'F');
            pdf.text('Data', 25, yPosition);
            pdf.text('Tarefa', 50, yPosition);
            pdf.text('Previsto', 120, yPosition);
            pdf.text('Real', 140, yPosition);
            pdf.text('Efic.', 160, yPosition);
            pdf.text('Status', 175, yPosition);

            yPosition += 10;

            // Dados da tabela
            pdf.setTextColor(0, 0, 0);
            const ultimasTarefas = this.dados.tarefas.slice(-20);

            ultimasTarefas.forEach((tarefa, index) => {
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 30;
                }

                // Alternar cor de fundo
                if (index % 2 === 0) {
                    pdf.setFillColor(248, 249, 250);
                    pdf.rect(20, yPosition - 5, 170, 8, 'F');
                }

                const tarefaNome = tarefa.tarefa.length > 30 
                    ? tarefa.tarefa.substring(0, 27) + '...' 
                    : tarefa.tarefa;

                pdf.text(tarefa.data, 25, yPosition);
                pdf.text(tarefaNome, 50, yPosition);
                pdf.text(tarefa.tempoPrevisto, 120, yPosition);
                pdf.text(tarefa.tempoReal, 140, yPosition);
                pdf.text(`${tarefa.eficiencia}%`, 160, yPosition);

                // Cor do status baseada na eficiência
                if (tarefa.eficiencia >= 90) pdf.setTextColor(40, 167, 69);
                else if (tarefa.eficiencia >= 70) pdf.setTextColor(23, 162, 184);
                else if (tarefa.eficiencia >= 50) pdf.setTextColor(255, 193, 7);
                else pdf.setTextColor(220, 53, 69);

                pdf.text(tarefa.status.replace(/[🌟👍👌⚠️📚]/g, ''), 175, yPosition);
                pdf.setTextColor(0, 0, 0);

                yPosition += 8;
            });

            // Rodapé
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Dashboard Olimpíadas SENAI Petrópolis - Sistema de Controle por Tarefa', 20, 285);

            // Salvar PDF
            const fileName = `Relatorio_Olimpiadas_SENAI_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
            pdf.save(fileName);

            this.showNotification('📄 PDF exportado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            this.showNotification('❌ Erro ao gerar PDF!', 'error');
        }
    }

    saveData() {
        localStorage.setItem('taskControlData', JSON.stringify(this.dados));
    }
}

// Inicializar o dashboard
document.addEventListener('DOMContentLoaded', () => {
    new TaskControlDashboard();
});