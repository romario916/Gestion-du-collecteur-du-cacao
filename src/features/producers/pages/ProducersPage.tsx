
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import ProducerForm from "../components/ProducerForm";
import ProducersTable from "../components/ProducersTable";
import ProducerDetails from "../components/ProducerDetails";

import type {
  Producer,
  CreateProducerInput,
  UpdateProducerInput,
} from "../producers.types";

import {
  getProducers,
  createProducer,
  updateProducer,
  deleteProducer,
} from "../producers.service";

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selectedProducer, setSelectedProducer] =
    useState<Producer | null>(null);
  const [detailsProducer, setDetailsProducer] =
    useState<Producer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshProducers();
  }, []);

  function refreshProducers() {
    setProducers(getProducers());
  }

  function handleCreate(data: CreateProducerInput) {
    try {
      createProducer(data);

      refreshProducers();
      setIsFormOpen(false);
      setSelectedProducer(null);

      toast.success("Producteur créé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de créer le producteur.",
      );
    }
  }

  function handleUpdate(data: UpdateProducerInput) {
    if (!selectedProducer) return;

    try {
      updateProducer(selectedProducer.id, data);

      refreshProducers();
      setIsFormOpen(false);
      setSelectedProducer(null);

      toast.success("Producteur modifié avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le producteur.",
      );
    }
  }

  function handleToggleStatus(target: Producer) {
    const newStatus = !target.actif;
    const action = newStatus ? "réactiver" : "désactiver";

    const confirmed = window.confirm(
      `Voulez-vous vraiment ${action} le producteur ${target.nom} ${target.prenom} ?`,
    );

    if (!confirmed) return;

    try {
      updateProducer(target.id, {
        nom: target.nom,
        prenom: target.prenom,
        telephone: target.telephone,
        email: target.email,
        adresse: target.adresse,
        fokontany: target.fokontany,
        commune: target.commune,
        district: target.district,
        region: target.region,
        superficie: target.superficie,
        nombreParcelles: target.nombreParcelles,
        actif: newStatus,
      });

      refreshProducers();

      toast.success(
        newStatus
          ? "Producteur réactivé avec succès."
          : "Producteur désactivé avec succès.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le statut du producteur.",
      );
    }
  }

  function handleDelete(target: Producer) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le producteur ${target.nom} ${target.prenom} ?`,
    );

    if (!confirmed) return;

    try {
      deleteProducer(target.id);

      refreshProducers();

      if (detailsProducer?.id === target.id) {
        setDetailsProducer(null);
      }

      toast.success("Producteur supprimé avec succès.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le producteur.",
      );
    }
  }

  const filteredProducers = producers.filter((producer) => {
    const searchValue = search.trim().toLowerCase();

    return (
      producer.numero.toLowerCase().includes(searchValue) ||
      producer.nom.toLowerCase().includes(searchValue) ||
      producer.prenom.toLowerCase().includes(searchValue) ||
      producer.telephone.toLowerCase().includes(searchValue) ||
      producer.commune.toLowerCase().includes(searchValue) ||
      producer.region.toLowerCase().includes(searchValue)
    );
  });

  const activeProducers = producers.filter(
    (producer) => producer.actif,
  ).length;

  const inactiveProducers = producers.filter(
    (producer) => !producer.actif,
  ).length;

  return (
    <div className="space-y-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EAB308]" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532D]">
              Gestion agricole
            </p>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Gestion des producteurs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Gérez les producteurs et les informations de leurs exploitations
            agricoles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedProducer(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#166534] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100"
        >
          <Plus size={18} />
          Ajouter un producteur
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total producteurs"
          value={producers.length}
          icon={<Users size={21} />}
          iconColor="bg-blue-50 text-[#2563EB]"
          accentColor="bg-[#2563EB]"
          description="Producteurs enregistrés"
        />

        <StatCard
          title="Producteurs actifs"
          value={activeProducers}
          icon={<UserCheck size={21} />}
          iconColor="bg-green-50 text-[#15803D]"
          accentColor="bg-[#15803D]"
          description="Producteurs opérationnels"
        />

        <StatCard
          title="Producteurs inactifs"
          value={inactiveProducers}
          icon={<UserX size={21} />}
          iconColor="bg-amber-50 text-[#CA8A04]"
          accentColor="bg-[#EAB308]"
          description="Producteurs désactivés"
        />
      </div>

      {/* Liste des producteurs */}
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                <Users size={18} />
              </div>

              <h2 className="font-bold text-gray-900">
                Liste des producteurs
              </h2>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Retrouvez et gérez les producteurs enregistrés dans
              l'application.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un producteur..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#14532D] focus:bg-white focus:ring-4 focus:ring-green-50"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <ProducersTable
            producers={filteredProducers}
            onView={(target) => setDetailsProducer(target)}
            onEdit={(target) => {
              setSelectedProducer(target);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3">
          <p className="text-xs text-gray-500">
            {filteredProducers.length} producteur(s) affiché(s)
            {search.trim() && " après recherche"}
          </p>
        </div>
      </section>

      {/* Détails */}
      {detailsProducer && (
        <ProducerDetails
          producer={detailsProducer}
          onClose={() => setDetailsProducer(null)}
        />
      )}

      {/* Formulaire */}
      {isFormOpen && (
        <ProducerForm
          producer={selectedProducer}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProducer(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconColor,
  accentColor,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  accentColor: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${accentColor}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
