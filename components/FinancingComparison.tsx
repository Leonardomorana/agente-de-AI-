import React from 'react';

const CheckIcon: React.FC = () => (
    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const WarningIcon: React.FC = () => (
    <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
);

const UserIcon: React.FC = () => (
    <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);


const ComparisonCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-50 p-6 rounded-lg w-full border border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-red-700 mb-4 text-center">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="text-gray-600 space-y-2 text-sm md:text-base">{children}</div>
    </div>
);

const ListItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-start">
        {icon}
        <span>{children}</span>
    </div>
);

const FinancingComparison: React.FC = () => {
    return (
        <div className="w-full mx-auto bg-white/80 rounded-lg shadow-lg border border-gray-200 overflow-hidden p-4 md:p-8 animate-fadeInUp">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Comparativo de Modalidades de Financiamento</h1>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                Entenda as principais diferenças entre o Crédito Associativo, comum em programas como Minha Casa Minha Vida, e o plano de pagamento direto com a construtora.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Coluna Financiamento Associativo */}
                <ComparisonCard title="Crédito Associativo">
                    <InfoSection title="O que é?">
                        <p>
                            Modalidade em que um grupo de compradores financia a construção do imóvel junto a um banco (geralmente a Caixa). O contrato de financiamento é assinado antes ou durante o início da obra.
                        </p>
                    </InfoSection>

                    <InfoSection title="Pagamentos Durante a Obra">
                        <p>
                            Você paga os "juros de obra" ao banco, que correspondem aos juros do valor que o banco repassa à construtora conforme a obra avança. O saldo devedor não é amortizado nesta fase.
                        </p>
                    </InfoSection>
                    
                    <InfoSection title="Vantagens">
                        <ListItem icon={<CheckIcon />}>
                            <strong>Segurança:</strong> O contrato com o banco é assinado no início, garantindo o crédito e as condições.
                        </ListItem>
                        <ListItem icon={<CheckIcon />}>
                            <strong>Preço Fixo:</strong> O valor do imóvel é "congelado" na assinatura, sem correção pelo INCC sobre o saldo financiado.
                        </ListItem>
                        <ListItem icon={<CheckIcon />}>
                            <strong>Taxas Atrativas:</strong> Geralmente associado a programas habitacionais, oferece as menores taxas de juros do mercado.
                        </ListItem>
                         <ListItem icon={<CheckIcon />}>
                            <strong>Uso do FGTS:</strong> Permite abater parte do valor da entrada com o FGTS.
                        </ListItem>
                    </InfoSection>
                    
                    <InfoSection title="Pontos de Atenção">
                        <ListItem icon={<WarningIcon />}>
                            O pagamento dos "juros de obra" se inicia logo após a assinatura com o banco.
                        </ListItem>
                    </InfoSection>

                    <InfoSection title="Perfil Ideal">
                        <ListItem icon={<UserIcon />}>
                            Compradores que buscam o primeiro imóvel, se enquadram no Minha Casa Minha Vida e querem segurança total no processo, garantindo o crédito e o valor do imóvel desde o início.
                        </ListItem>
                    </InfoSection>
                </ComparisonCard>

                {/* Coluna Plano Direto / 30/70 */}
                <ComparisonCard title="Plano Direto com a Construtora">
                    <InfoSection title="O que é?">
                        <p>
                            Você paga uma parte do valor do imóvel (ex: 30%) diretamente para a construtora durante o período de obras. O restante (ex: 70%) é quitado com financiamento bancário ou recursos próprios na entrega das chaves.
                        </p>
                    </InfoSection>

                    <InfoSection title="Pagamentos Durante a Obra">
                        <p>
                            Você paga um sinal (entrada) e parcelas mensais/balões à construtora. Essas parcelas são corrigidas mensalmente pelo INCC (Índice Nacional de Custo da Construção).
                        </p>
                    </InfoSection>

                    <InfoSection title="Vantagens">
                         <ListItem icon={<CheckIcon />}>
                            <strong>Flexibilidade:</strong> Maior tempo para se organizar financeiramente e buscar o financiamento bancário apenas no final.
                        </ListItem>
                         <ListItem icon={<CheckIcon />}>
                            <strong>Sem Juros de Obra:</strong> Você não paga juros de obra ao banco, mas sim parcelas corrigidas pelo INCC.
                        </ListItem>
                         <ListItem icon={<CheckIcon />}>
                            <strong>Negociação:</strong> O fluxo de pagamento durante a obra pode, por vezes, ser negociado com a construtora.
                        </ListItem>
                    </InfoSection>

                     <InfoSection title="Pontos de Atenção">
                         <ListItem icon={<WarningIcon />}>
                            <strong>Risco de Crédito:</strong> A aprovação do financiamento não é garantida. Sua situação financeira pode mudar até a entrega das chaves.
                        </ListItem>
                        <ListItem icon={<WarningIcon />}>
                            <strong>Correção pelo INCC:</strong> O saldo devedor a ser financiado aumenta durante a obra, pois é corrigido pelo INCC, que pode variar bastante.
                        </ListItem>
                        <ListItem icon={<WarningIcon />}>
                            <strong>Taxas Futuras:</strong> As taxas de juros do financiamento bancário podem estar mais altas no futuro, quando você for contratar.
                        </ListItem>
                    </InfoSection>
                    
                     <InfoSection title="Perfil Ideal">
                        <ListItem icon={<UserIcon />}>
                            Compradores com boa reserva para a entrada, investidores, ou quem precisa de mais tempo para se preparar para o financiamento bancário e entende os riscos da correção pelo INCC.
                        </ListItem>
                    </InfoSection>
                </ComparisonCard>
            </div>
        </div>
    );
};

export default FinancingComparison;