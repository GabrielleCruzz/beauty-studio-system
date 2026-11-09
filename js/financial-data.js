(() => {
    const chaveAgendamentos = "beautyStudio.appointments.v1";
    const profissionais = ["Val", "Anny"];

    function lerAgendamentos() {
        const dados = localStorage.getItem(chaveAgendamentos);
        if (dados === null) return null;

        const registros = JSON.parse(dados);
        if (!Array.isArray(registros) || registros.some(registro =>
            !registro
            || typeof registro.data !== "string"
            || !/^\d{4}-\d{2}-\d{2}$/.test(registro.data)
            || !["concluido", "naoiniciado", "emandamento"].includes(registro.status)
            || !Array.isArray(registro.procedimentos)
        )) {
            throw new Error("Os agendamentos salvos neste navegador estão inválidos.");
        }

        return registros;
    }

    function lerValor(valor) {
        if (typeof valor === "number") return Number.isFinite(valor) ? valor : 0;
        if (typeof valor !== "string" || !valor.trim()) return 0;

        const texto = valor.trim().replace(/[^\d,.-]/g, "");
        const normalizado = texto.includes(",")
            ? texto.replace(/\./g, "").replace(",", ".")
            : texto;
        const numero = Number(normalizado);
        return Number.isFinite(numero) ? numero : 0;
    }

    function resumir(registros, inicio, fim) {
        const resumo = Object.fromEntries(profissionais.map(nome => [
            nome,
            { atendimentos: 0, faturamento: 0 }
        ]));

        registros
            .filter(registro =>
                registro.status === "concluido"
                && registro.data >= inicio
                && registro.data <= fim
            )
            .forEach(registro => {
                const atribuicoes = registro.procedimentos.filter(item =>
                    item && profissionais.includes(item.profissional)
                );
                const profissionaisDoAtendimento = new Set(
                    atribuicoes.map(item => item.profissional)
                );

                profissionaisDoAtendimento.forEach(nome => {
                    resumo[nome].atendimentos += 1;
                    const itensComValor = atribuicoes.filter(item =>
                        item.profissional === nome
                        && item.valor !== null
                        && item.valor !== undefined
                        && item.valor !== ""
                    );

                    if (itensComValor.length > 0) {
                        resumo[nome].faturamento += itensComValor.reduce(
                            (total, item) => total + lerValor(item.valor),
                            0
                        );
                    } else if (profissionaisDoAtendimento.size === 1) {
                        resumo[nome].faturamento += lerValor(registro.valor);
                    }
                });
            });

        return resumo;
    }

    function totalAtendimentos(registros, inicio, fim) {
        return registros.filter(registro =>
            registro.status === "concluido"
            && registro.data >= inicio
            && registro.data <= fim
        ).length;
    }

    window.beautyStudioReports = { lerAgendamentos, resumir, totalAtendimentos };
})();
